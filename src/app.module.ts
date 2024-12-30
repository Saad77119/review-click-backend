import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { ValidationModule } from 'validation/validation.module';
import { DatabaseModule } from 'database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ValidationModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
