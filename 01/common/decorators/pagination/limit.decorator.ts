import { ECommonRestrictions } from '@inft-common/shared/utils/restrictions/common-restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class LimitDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new LimitRequired())
            .set(Required.NULLABLE, new LimitNullable())
            .set(Required.OPTIONAL, new LimitOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: Number,
                description: 'Limit',
                minimum: ECommonRestrictions.LimitMin,
                maximum: ECommonRestrictions.LimitMax,
                example: ECommonRestrictions.LimitMin,
            }),
            IsNotEmpty(),
            Type(() => Number),
            IsNumber(),
            Max(ECommonRestrictions.LimitMax),
            Min(ECommonRestrictions.LimitMin),
        ];
    }
}

export class LimitRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LimitDecoratorStrategy.default(true),
        );
    }
}

export class LimitNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LimitDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class LimitOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LimitDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Limit(requiredType: Required = Required.STRONG) {
    return LimitDecoratorStrategy.variables(requiredType).getDecorator();
}
