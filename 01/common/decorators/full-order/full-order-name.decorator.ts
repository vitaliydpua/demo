import { EFullOrdersRestrictions } from '@inft-common/restrictions/full-order/full-orders.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class FullOrderNameDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new FullOrderNameRequired())
            .set(Required.NULLABLE, new FullOrderNameNullable())
            .set(Required.OPTIONAL, new FullOrderNameOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Order 1',
                type: String,
                description: 'Some name of the order',
                minLength: EFullOrdersRestrictions.NAME_MIN,
                maxLength: EFullOrdersRestrictions.NAME_MAX,
            }),
            IsString(),
            MinLength(EFullOrdersRestrictions.NAME_MIN),
            MaxLength(EFullOrdersRestrictions.NAME_MAX),
            IsNotEmpty(),
        ];
    }
}

export class FullOrderNameRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FullOrderNameDecoratorStrategy.default(true),
        );
    }
}

export class FullOrderNameNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FullOrderNameDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class FullOrderNameOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FullOrderNameDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function FullOrderName(requiredType: Required = Required.STRONG) {
    return FullOrderNameDecoratorStrategy.variables(requiredType).getDecorator();
}
