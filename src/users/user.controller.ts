import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Scopes } from '../auth/decorators/scopes.decorator';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Scopes('organization:read')
  @Get('data')
  getData() {
    return { message: 'You have access to this endpoint!' };
  }
}
