import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as isTimestamp from 'validate.io-timestamp';


export function IsTimestamp(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsTimestamp',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments): boolean {
          return isTimestamp(value);
        },
      },
    });
  };
}
