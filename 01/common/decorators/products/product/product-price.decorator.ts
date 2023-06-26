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
import { PATTERNS } from "@inft-common/shared/utils/patterns";


export class ProductPriceDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductPriceRequired())
            .set(Required.NULLABLE, new ProductPriceNullable())
            .set(Required.OPTIONAL, new ProductPriceOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 50,
                type: Number,
                description: 'Product price',
                minimum: EProductRestrictions.PRICE_MIN,
                maximum: EProductRestrictions.PRICE_MAX,
            }),
            IsNumber(),
            Min(EProductRestrictions.PRICE_MIN),
            Max(EProductRestrictions.PRICE_MAX),
        ];
    }
}

export class ProductPriceRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductPriceDecoratorStrategy.default(true),
        );
    }
}

export class ProductPriceNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductPriceDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductPriceOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductPriceDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductPrice(requiredType: Required = Required.STRONG) {
    return ProductPriceDecoratorStrategy.variables(requiredType).getDecorator();
}
