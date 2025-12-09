const { Injectable, NotFoundException, ConflictException, Inject } = require('@nestjs/common');
const { InjectRepository } = require('@nestjs/typeorm');
const bcrypt = require('bcrypt');
const { User } = require('./entities/user.entity');

@Injectable()
class UsersService {
  constructor(@InjectRepository(User) usersRepository) {
    this.usersRepository = usersRepository;
  }

  async create(createUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findAll() {
    const users = await this.usersRepository.find({
      relations: ['products'],
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  async findOne(id) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['products'],
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id, updateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.username || updateUserDto.email) {
      const duplicate = await this.usersRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Username or email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async remove(id) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.remove(user);
    return { message: `User with ID ${id} has been deleted` };
  }
}

module.exports = { UsersService };