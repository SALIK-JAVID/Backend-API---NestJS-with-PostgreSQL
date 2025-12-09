const { Module, forwardRef } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { UsersService } = require('./users.service');
const { UsersController } = require('./users.controller');
const { User } = require('./entities/user.entity');

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
class UsersModule {}

module.exports = { UsersModule };