import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, Length, ValidateIf } from 'class-validator';

import { ECodeLength } from '../../shared/enums/code-length.enum';

import { IPropStrategy, Required } from '../index';

export class PinCodeDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new PinCodeRequired())
      .set(Required.NULLABLE, new PinCodeNullable())
      .set(Required.OPTIONAL, new PinCodeOptional());
    return map.get(requiredType)!;
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        example: '202109',
        type: String,
        description: 'Pin',
        minLength: ECodeLength.SMS_PIN,
        maxLength: ECodeLength.SMS_PIN,
      }),
      Length(ECodeLength.SMS_PIN, ECodeLength.SMS_PIN, {
        message: 'Pin must be equal to 6 characters',
      }),
      IsNumberString(),
      IsNotEmpty(),
    ];
  }
}

export class PinCodeRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...PinCodeDecoratorStrategy.default(true),
    );
  }
}

export class PinCodeNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...PinCodeDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class PinCodeOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...PinCodeDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function PinCode(requiredType: Required = Required.STRONG) {
  return PinCodeDecoratorStrategy.variables(requiredType).getDecorator();
}
