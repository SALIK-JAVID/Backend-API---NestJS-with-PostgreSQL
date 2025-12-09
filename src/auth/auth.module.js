const { Module, forwardRef } = require('@nestjs/common');
const { JwtModule } = require('@nestjs/jwt');
const { PassportModule } = require('@nestjs/passport');
const { AuthService } = require('./auth.service');
const { AuthController } = require('./auth.controller');
const { JwtStrategy } = require('./jwt.strategy');
const { UsersModule } = require('../users/users.module');

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345',
      signOptions: { 
        expiresIn: process.env.JWT_EXPIRATION || '1d' 
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
class AuthModule {}

module.exports = { AuthModule };