import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EProductRestrictions } from "@inft-common/restrictions/product/product.restrictions";


export class ProductDescriptionDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductDescriptionRequired())
            .set(Required.NULLABLE, new ProductDescriptionNullable())
            .set(Required.OPTIONAL, new ProductDescriptionOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Some product description...',
                type: String,
                description: 'Product description',
                minLength: EProductRestrictions.DESCRIPTION_MIN_LENGTH,
                maxLength: EProductRestrictions.DESCRIPTION_MAX_LENGTH,
            }),
            IsString(),
            IsNotEmpty(),
            MinLength(EProductRestrictions.DESCRIPTION_MIN_LENGTH),
            MaxLength(EProductRestrictions.DESCRIPTION_MAX_LENGTH),
        ];
    }
}

export class ProductDescriptionRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductDescriptionDecoratorStrategy.default(true),
        );
    }
}

export class ProductDescriptionNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductDescriptionDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductDescriptionOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductDescriptionDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductDescription(requiredType: Required = Required.STRONG) {
    return ProductDescriptionDecoratorStrategy.variables(requiredType).getDecorator();
}
