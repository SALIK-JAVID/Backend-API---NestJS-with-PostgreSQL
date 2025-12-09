const { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Inject } = require('@nestjs/common');
const { UsersService } = require('./users.service');
const { CreateUserDto } = require('./dto/create-user.dto');
const { UpdateUserDto } = require('./dto/update-user.dto');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');

@Controller('users')
@UseGuards(JwtAuthGuard)
class UsersController {
  constructor(@Inject(UsersService) usersService) {
    this.usersService = usersService;
  }

  @Post()
  async create(@Body() body) {
    const errors = CreateUserDto.validate(body);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.usersService.findOne(parseInt(id));
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() body) {
    const errors = UpdateUserDto.validate(body);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.usersService.update(parseInt(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return this.usersService.remove(parseInt(id));
  }
}

module.exports = { UsersController };