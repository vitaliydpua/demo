import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EProductCategoryRestrictions } from "@inft-common/restrictions/product/product-category.restrictions";


export class ProductCategoryNameDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductCategoryNameRequired())
            .set(Required.NULLABLE, new ProductCategoryNameNullable())
            .set(Required.OPTIONAL, new ProductCategoryNameOptional());
        return <IPropStrategy>map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Category 1',
                type: String,
                description: 'Product category name',
                minLength: EProductCategoryRestrictions.NAME_MIN,
                maxLength: EProductCategoryRestrictions.NAME_MAX,
            }),
            MinLength(EProductCategoryRestrictions.NAME_MIN),
            MaxLength(EProductCategoryRestrictions.NAME_MAX),
            IsString(),
            IsNotEmpty(),
        ];
    }
}

export class ProductCategoryNameRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductCategoryNameDecoratorStrategy.default(true),
        );
    }
}

export class ProductCategoryNameNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductCategoryNameDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductCategoryNameOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductCategoryNameDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductCategoryName(requiredType: Required = Required.STRONG) {
    return ProductCategoryNameDecoratorStrategy.variables(requiredType).getDecorator();
}
