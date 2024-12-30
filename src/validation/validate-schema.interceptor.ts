import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { defaults } from 'lodash-es';
import { ValidationOptions, ValidationSchema } from 'validation/decorators';
import type { ValidateFunction } from 'validation/utils';
import { throwOnValidationError } from 'validation/utils';

@Injectable()
export class RequestValidateSchemaInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const schemaProviderDependency = this.reflector.get(
      ValidationSchema,
      context.getHandler(),
    );
    let validationOptions = this.reflector.get(
      ValidationOptions,
      context.getHandler(),
    );
    validationOptions = defaults({}, validationOptions, {
      throwOnError: true,
      source: 'body',
    });
    let validator: ValidateFunction<unknown> = this.moduleRef.get(
      schemaProviderDependency,
    );

    if (validationOptions.throwOnError) {
      validator = throwOnValidationError(validator, validator.client) as any;
    }
    if (!validationOptions.source) {
      throw new InternalServerErrorException('Validation Source Not Found');
    }
    const request = context.switchToHttp().getRequest();
    const toValidate = request[validationOptions.source];
    validator(toValidate);

    return next.handle();
  }
}
