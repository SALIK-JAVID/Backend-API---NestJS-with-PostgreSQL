const { Controller, Post, Body, Get, UseGuards, Request, BadRequestException, Inject } = require('@nestjs/common');
const { AuthService } = require('./auth.service');
const { CreateUserDto } = require('../users/dto/create-user.dto');
const { JwtAuthGuard } = require('./guards/jwt-auth.guard');

@Controller('auth')
class AuthController {
  constructor(@Inject(AuthService) authService) {
    this.authService = authService;
  }

  @Post('register')
  async register(@Body() body) {
    const errors = CreateUserDto.validate(body);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body) {
    if (!body.email || !body.password) {
      throw new BadRequestException(['Email and password are required']);
    }
    return this.authService.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      message: 'Profile retrieved successfully',
      user: req.user,
    };
  }
}

module.exports = { AuthController };