import { Reflector } from '@nestjs/core';

export const ValidationSchema = Reflector.createDecorator<string>();
export const ValidationOptions = Reflector.createDecorator<{
  source?: 'params' | 'query' | 'body';
  throwOnError?: boolean;
}>();
