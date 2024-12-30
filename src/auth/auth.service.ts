import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (
      user &&
      (await this.usersService.comparePasswords(pass, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      scopes: user.scopes,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
