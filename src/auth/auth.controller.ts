import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    // const payload = { username: loginDto.username, sub: loginDto.id, scopes: user.scopes };
    // return {
    //   accessToken: this.jwtService.sign(payload),
    // };
    // return this.authService.login(
    //   await this.authService.validateUser(loginDto.username, loginDto.password),
    // );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
