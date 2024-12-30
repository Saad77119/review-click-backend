import type { Provider } from '@nestjs/common';
import type { Schema, ValidateFunction as AjvValidateFunction } from 'ajv';
import type Ajv from 'ajv';
import { defaults } from 'lodash-es';
import type { FieldState } from 'types/response';
import { VALIDATION_CONSTANTS } from 'validation/constants';
import { BadInputError } from './errors/bad-input-error';

export type ValidateFunction<T = unknown> = AjvValidateFunction<T> & {
  client?: Ajv;
};

export const ajvSchemaServiceBuilder = (
  name: string,
  schema: Schema,
): Provider => {
  return {
    provide: name,
    useFactory: (ajv: Ajv) => {
      const func: ValidateFunction = ajv.compile(schema);
      func.client = ajv;
      return func;
    },
    inject: [VALIDATION_CONSTANTS.AJV],
  };
};

// export const ajvClient = new Ajv({
//     allErrors: true,
//     removeAdditional: true,
//     useDefaults: true,
//     discriminator: true,
// });

// export const bqAjvClient = new Ajv({
//     allErrors: true,
//     allowUnionTypes: true,
//     removeAdditional: false,
// });
// addFormats(bqAjvClient);

export const throwOnValidationError = (
  func: ValidateFunction,
  _client: Ajv | undefined,
  config: any = {},
) => {
  config = defaults({}, config, {
    invalidFieldsToNull: false,
  });
  const modified: (data: any) => true = (...props) => {
    const isValid = func(...props);
    const errors = func.errors;
    if (isValid) {
      return isValid;
    } else {
      const fieldStates = errors?.reduce((acc: FieldState[], err) => {
        const [_, ...rest] = err.instancePath.split('/');
        if (err.keyword === 'required') {
          rest.push(err.params.missingProperty as string);
        }
        const identifier = rest.join('.');
        let fieldState = acc.find((x) => x.identifier === identifier);
        if (!fieldState) {
          fieldState = {
            identifier,
            errors: [],
          };
          acc.push(fieldState);
        }
        fieldState.errors.push({
          code: err.keyword,
          message: err?.message || 'Unknown Error',
        });
        if (config.invalidFieldsToNull) {
          rest.reduce((item, prop, index) => {
            if (index === rest.length - 1) {
              if (Array.isArray(item)) {
                item.splice(+prop, 1);
              } else {
                item[prop] = null;
              }
            }
            return item[prop];
          }, props[0]);
        }

        return acc;
      }, []);
      throw new BadInputError('Input Validation Failed', fieldStates);
    }
  };

  return modified;
};
