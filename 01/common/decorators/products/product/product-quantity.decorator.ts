import { IPropStrategy, Required } from '@inft-common/decorators';
import { EProductRestrictions } from '@inft-common/restrictions/product/product.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsOptional, Max, Min,
    ValidateIf
} from 'class-validator';

export class ProductQuantityDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductQuantityRequired())
            .set(Required.NULLABLE, new ProductQuantityNullable())
            .set(Required.OPTIONAL, new ProductQuantityOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 1,
                type: Number,
                description: 'Quantity',
                minimum: EProductRestrictions.MIN_QUANTITY,
                maximum: EProductRestrictions.MAX_QUANTITY,
            }),
            IsNumber(),
            Min(EProductRestrictions.MIN_QUANTITY),
            Max(EProductRestrictions.MAX_QUANTITY),
            Type(() => Number),
        ];
    }
}

export class ProductQuantityRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductQuantityDecoratorStrategy.default(true),
        );
    }
}

export class ProductQuantityNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductQuantityDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductQuantityOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductQuantityDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductQuantity(requiredType: Required = Required.STRONG) {
    return ProductQuantityDecoratorStrategy.variables(requiredType).getDecorator();
}
