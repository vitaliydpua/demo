import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, Validate, ValidateIf } from 'class-validator';

import { PhoneNumberFormatValidator } from '../../validators/phone-number-format.validator';

import { IPropStrategy, Required } from '../index';


export class PhoneNumberDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new PhoneNumberRequired())
      .set(Required.NULLABLE, new PhoneNumberNullable())
      .set(Required.OPTIONAL, new PhoneNumberOptional());
    return map.get(requiredType)!;
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        example: '12128495867',
        description: 'Phone number',
        type: String,
      }),
      IsNumberString(),
      IsNotEmpty(),
      Validate(PhoneNumberFormatValidator),
    ];
  }
}

export class PhoneNumberRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...PhoneNumberDecoratorStrategy.default(true),
    );
  }
}

export class PhoneNumberNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...PhoneNumberDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class PhoneNumberOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...PhoneNumberDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function PhoneNumber(requiredType: Required = Required.STRONG) {
  return PhoneNumberDecoratorStrategy.variables(requiredType).getDecorator();
}
