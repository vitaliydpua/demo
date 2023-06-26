import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EProductRestrictions } from "@inft-common/restrictions/product/product.restrictions";


export class ProductNameDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductNameRequired())
            .set(Required.NULLABLE, new ProductNameNullable())
            .set(Required.OPTIONAL, new ProductNameOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Some product name 1',
                type: String,
                description: 'Product name',
                minLength: EProductRestrictions.NAME_MIN_LENGTH,
                maxLength: EProductRestrictions.NAME_MAX_LENGTH,
            }),
            IsString(),
            IsNotEmpty(),
            MinLength(EProductRestrictions.NAME_MIN_LENGTH),
            MaxLength(EProductRestrictions.NAME_MAX_LENGTH),
        ];
    }
}

export class ProductNameRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductNameDecoratorStrategy.default(true),
        );
    }
}

export class ProductNameNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductNameDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductNameOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductNameDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductName(requiredType: Required = Required.STRONG) {
    return ProductNameDecoratorStrategy.variables(requiredType).getDecorator();
}
