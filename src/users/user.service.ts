import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      username: 'admin',
      password: '$2b$10$wEoZ9QTx3D1bV7zFnVRr3eTT/WuHpi6dclT9uV4oC/E2MKGVTTyzW', // 'password'
      scopes: ['organization:read', 'company:write'],
    },
  ];

  async findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
