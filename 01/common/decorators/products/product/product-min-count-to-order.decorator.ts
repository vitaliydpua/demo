import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches, Max,
    MaxLength,
    Min,
    MinLength,
    ValidateIf
} from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EProductRestrictions } from "@inft-common/restrictions/product/product.restrictions";


export class ProductMinCountToOrderDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductMinCountToOrderRequired())
            .set(Required.NULLABLE, new ProductMinCountToOrderNullable())
            .set(Required.OPTIONAL, new ProductMinCountToOrderOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 5,
                type: Number,
                description: 'Min count of items to order',
                minimum: EProductRestrictions.MIN_COUNT_TO_ORDER_MIN,
                maximum: EProductRestrictions.MIN_COUNT_TO_ORDER_MAX,
            }),
            IsNumber(),
            Min(EProductRestrictions.MIN_COUNT_TO_ORDER_MIN),
            Max(EProductRestrictions.MIN_COUNT_TO_ORDER_MAX),
        ];
    }
}

export class ProductMinCountToOrderRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductMinCountToOrderDecoratorStrategy.default(true),
        );
    }
}

export class ProductMinCountToOrderNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductMinCountToOrderDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductMinCountToOrderOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductMinCountToOrderDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductMinCountToOrder(requiredType: Required = Required.STRONG) {
    return ProductMinCountToOrderDecoratorStrategy.variables(requiredType).getDecorator();
}
