import { Module } from '@nestjs/common';
import { UsersService } from 'users/user.service';
import { UserController } from 'users/user.controller';

@Module({
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
