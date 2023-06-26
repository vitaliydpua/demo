import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";


import { IPropStrategy, Required } from '../../index';
import { EBusinessUserRestrictions } from "@inft-common/restrictions/user/business-user.restrictions";

export class CompanyNameDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new CompanyNameRequired())
      .set(Required.NULLABLE, new CompanyNameNullable())
      .set(Required.OPTIONAL, new CompanyNameOptional());
    return map.get(requiredType)!;
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        example: 'Company 1',
        type: String,
        description: 'Some company name',
        minLength: EBusinessUserRestrictions.NAME_MIN,
        maxLength: EBusinessUserRestrictions.NAME_MAX,
      }),
      MinLength(EBusinessUserRestrictions.NAME_MIN),
      MaxLength(EBusinessUserRestrictions.NAME_MAX),
      IsString(),
      IsNotEmpty(),
    ];
  }
}

export class CompanyNameRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...CompanyNameDecoratorStrategy.default(true),
    );
  }
}

export class CompanyNameNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...CompanyNameDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class CompanyNameOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...CompanyNameDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function CompanyName(requiredType: Required = Required.STRONG) {
  return CompanyNameDecoratorStrategy.variables(requiredType).getDecorator();
}
