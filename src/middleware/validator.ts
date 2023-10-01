import { Context, Next } from '../deps.ts';
import { responseError } from '../utils.ts';

type ValidatorFunction = (value: string, key: string, context: Context) => boolean;

interface LenghtValidation {
  min?: number;
  max?: number;
}

interface ValidatorParams {
  key: string;
  validators: ValidatorFunction[];
}

export default class Validator {
  static checkParam(args: ValidatorParams[]) {
    return async (context: Context, next: Next) => {
      if (!args.length) {
        return await next();
      }

      for (const arg of args) {
        const value = context.request.url.searchParams.get(arg.key) || '';

        for (const validator of arg.validators) {
          if (!validator(value, arg.key, context)) {
            return false;
          }
        }
      }

      return await next();
    };
  }

  static required() {
    return (value: string, key: string, context: Context) => {
      if (!value) {
        return responseError(context, new Error(`Invalid ${key} input. Cause: it is empty.`), 400);
      }

      return true;
    };
  }

  static hasLenght(lengthValidation: LenghtValidation) {
    return (value: string, key: string, context: Context) => {
      if (!value) {
        return true;
      }

      if (lengthValidation.max && value.length > lengthValidation.max) {
        return responseError(
          context,
          new Error(`Invalid ${key} input. Cause: it is greater than ${lengthValidation.max} characters.`),
          422,
        );
      }

      return true;
    };
  }

  static isUrl() {
    return (value: string, key: string, context: Context) => {
      if (!value) {
        return true;
      }

      if (!RegExp(/^(http|https|file):/, 'i').exec(value)) {
        return responseError(context, new Error(`Invalid ${key} input. Cause: it is not a valid URL.`), 422);
      }

      return true;
    };
  }

  static isNumeric() {
    return (value: string, key: string, context: Context) => {
      if (!value) {
        return true;
      }

      if (isNaN(Number(value))) {
        return responseError(context, new Error(`Invalid ${key} input. Cause: it is not a valid number.`), 422);
      }

      return true;
    };
  }

  static isBoolean() {
    return (value: string, key: string, context: Context) => {
      if (!value) {
        return true;
      }

      if (value !== 'true' && value !== 'false') {
        return responseError(context, new Error(`Invalid ${key} input. Cause: it is not a valid boolean.`), 422);
      }

      return true;
    };
  }
}
