import { Context, Next } from '../deps.ts';
import { responseError } from '../utils.ts';

type ValidatorFunction = (key: string, context: Context) => boolean;

export default class Validator {
  static checkParam(str: string, validators: ValidatorFunction[]) {
    return async (context: Context, next: Next) => {
      if (validators.length === 0) {
        return await next();
      }

      for (const validator of validators) {
        if (!(await validator(str, context))) {
          return false;
        }
      }

      return await next();
    };
  }

  static required() {
    return (key: string, context: Context) => {
      const value = context.request.url.searchParams.get(key);

      if (!value) {
        return responseError(context, new Error(`Invalid ${key} input. Cause: it is empty.`), 400);
      }

      return true;
    };
  }

  static hasLenght(lengthValidation: LenghtValidation) {
    return (key: string, context: Context) => {
      const value = context.request.url.searchParams.get(key);
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
    return (key: string, context: Context) => {
      const value = context.request.url.searchParams.get(key);
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
    return (key: string, context: Context) => {
      const value = context.request.url.searchParams.get(key);
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
    return (key: string, context: Context) => {
      const value = context.request.url.searchParams.get(key);
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

interface LenghtValidation {
  min?: number;
  max?: number;
}
