import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    Max,
    Min,
    ValidateIf
} from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EProductRestrictions } from "@inft-common/restrictions/product/product.restrictions";


export class ProductDiscountDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductDiscountRequired())
            .set(Required.NULLABLE, new ProductDiscountNullable())
            .set(Required.OPTIONAL, new ProductDiscountOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 20,
                type: Number,
                description: 'Product discount',
                minimum: EProductRestrictions.DISCOUNT_MIN,
                maximum: EProductRestrictions.DISCOUNT_MAX,
            }),
            IsNumber(),
            Min(EProductRestrictions.DISCOUNT_MIN),
            Max(EProductRestrictions.DISCOUNT_MAX),
        ];
    }
}

export class ProductDiscountRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductDiscountDecoratorStrategy.default(true),
        );
    }
}

export class ProductDiscountNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductDiscountDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductDiscountOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductDiscountDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductDiscount(requiredType: Required = Required.STRONG) {
    return ProductDiscountDecoratorStrategy.variables(requiredType).getDecorator();
}
