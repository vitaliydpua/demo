import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min, ValidateIf } from "class-validator";


import { IPropStrategy, Required } from '../../index';
import { EBusinessUserRestrictions } from "@inft-common/restrictions/user/business-user.restrictions";
import { EGeneralRestrictions } from '@inft-common/restrictions/general.restrictions';
import { Type } from 'class-transformer';

export class DistanceDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new DistanceRequired())
      .set(Required.NULLABLE, new DistanceNullable())
      .set(Required.OPTIONAL, new DistanceOptional());
    return map.get(requiredType)!;
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        example: '100',
        type: Number,
        description: 'Radius',
        minimum: EGeneralRestrictions.MIN_SEARCH_DISTANCE,
        maximum: EGeneralRestrictions.MAX_SEARCH_DISTANCE,
      }),
      Min(EGeneralRestrictions.MIN_SEARCH_DISTANCE),
      Max(EGeneralRestrictions.MAX_SEARCH_DISTANCE),
      IsNumber(),
      Type(() => Number)
    ];
  }
}

export class DistanceRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...DistanceDecoratorStrategy.default(true),
    );
  }
}

export class DistanceNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...DistanceDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class DistanceOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...DistanceDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function Distance(requiredType: Required = Required.STRONG) {
  return DistanceDecoratorStrategy.variables(requiredType).getDecorator();
}
