import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.get<string[]>(
      'scopes',
      context.getHandler(),
    );
    if (!requiredScopes) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasScope = requiredScopes.some((scope) =>
      user.scopes.includes(scope),
    );

    if (!hasScope) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return hasScope;
  }
}
