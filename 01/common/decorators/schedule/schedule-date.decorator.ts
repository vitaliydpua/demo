import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../index';
import { PATTERNS } from "@inft-common/shared/utils/patterns";

export class ScheduleDateDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new ScheduleDateRequired())
      .set(Required.NULLABLE, new ScheduleDateNullable())
      .set(Required.OPTIONAL, new ScheduleDateOptional());
    return map.get(requiredType)!;
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        example: '08:00, 18:00, 06:00 AM, 10:00 PM',
        type: String,
        description: 'Schedule date',
      }),
      IsNotEmpty(),
      IsString(),
      Matches(PATTERNS.scheduleDate, { message: 'Invalid date format (08:00, 18:00, 06:00 AM, 10:00 PM)' }),
    ];
  }
}

export class ScheduleDateRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...ScheduleDateDecoratorStrategy.default(true),
    );
  }
}

export class ScheduleDateNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...ScheduleDateDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class ScheduleDateOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...ScheduleDateDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function ScheduleDate(requiredType: Required = Required.STRONG) {
  return ScheduleDateDecoratorStrategy.variables(requiredType).getDecorator();
}
