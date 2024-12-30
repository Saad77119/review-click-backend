import { Module } from '@nestjs/common';
import Ajv from 'ajv';
import { RequestValidateSchemaInterceptor } from 'validation/validate-schema.interceptor';
import { VALIDATION_CONSTANTS } from 'validation/constants';

const ajv = {
  provide: VALIDATION_CONSTANTS.AJV,
  useValue: new Ajv({}),
};

@Module({
  exports: [ajv, RequestValidateSchemaInterceptor],
  providers: [ajv, RequestValidateSchemaInterceptor],
})
export class ValidationModule {}
