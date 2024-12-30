import { BadRequestException } from '@nestjs/common';
import type { FieldState } from 'types/response';

export class BadInputError extends BadRequestException {
  errorDetails: FieldState[];
  constructor(message: string, fieldErrors: FieldState[] = []) {
    super(message);
    this.name = 'BadInputError';
    this.errorDetails = fieldErrors;
  }
}
