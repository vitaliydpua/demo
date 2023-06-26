import { EOrderRestrictions } from '@inft-common/restrictions/order/order.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class OrderCommentDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new OrderCommentRequired())
            .set(Required.NULLABLE, new OrderCommentNullable())
            .set(Required.OPTIONAL, new OrderCommentOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Some comment',
                type: String,
                description: 'Order comment',
            }),
            IsString(),
            MinLength(EOrderRestrictions.NOTE_MIN),
            MaxLength(EOrderRestrictions.NOTE_MAX),
            IsNotEmpty(),
        ];
    }
}

export class OrderCommentRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...OrderCommentDecoratorStrategy.default(true),
        );
    }
}

export class OrderCommentNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...OrderCommentDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class OrderCommentOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...OrderCommentDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function OrderComment(requiredType: Required = Required.STRONG) {
    return OrderCommentDecoratorStrategy.variables(requiredType).getDecorator();
}
