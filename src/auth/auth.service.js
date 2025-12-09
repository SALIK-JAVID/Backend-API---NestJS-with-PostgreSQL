const { Injectable, UnauthorizedException, forwardRef, Inject } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const bcrypt = require('bcrypt');
const { UsersService } = require('../users/users.service');

@Injectable()
class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) usersService,
    @Inject(JwtService) jwtService
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async register(createUserDto) {
    const user = await this.usersService.create(createUserDto);

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      access_token,
    };
  }

  async login(loginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      access_token,
    };
  }

  async validateUser(payload) {
    const user = await this.usersService.findByEmail(payload.email);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}

module.exports = { AuthService };