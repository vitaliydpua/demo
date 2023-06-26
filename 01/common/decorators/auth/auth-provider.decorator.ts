import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../index';
import { EAuthProvider } from "@inft-app/auth/enums/auth-provider.enum";

export class AuthProviderDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new AuthProviderRequired())
      .set(Required.NULLABLE, new AuthProviderNullable())
      .set(Required.OPTIONAL, new AuthProviderOptional());
    return map.get(requiredType)!;
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        example: EAuthProvider.PHONE,
        type: String,
        enum: EAuthProvider,
        description: 'Auth provider',
      }),
      IsNotEmpty(),
      IsEnum(EAuthProvider)
    ];
  }
}

export class AuthProviderRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...AuthProviderDecoratorStrategy.default(true),
    );
  }
}

export class AuthProviderNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...AuthProviderDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class AuthProviderOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...AuthProviderDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function AuthProvider(requiredType: Required = Required.STRONG) {
  return AuthProviderDecoratorStrategy.variables(requiredType).getDecorator();
}
