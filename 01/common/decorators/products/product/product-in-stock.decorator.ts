import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    ValidateIf
} from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";


export class ProductInStockDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ProductInStockRequired())
            .set(Required.NULLABLE, new ProductInStockNullable())
            .set(Required.OPTIONAL, new ProductInStockOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: true,
                type: Boolean,
                description: 'In stock true/false',
            }),
            IsBoolean(),
        ];
    }
}

export class ProductInStockRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductInStockDecoratorStrategy.default(true),
        );
    }
}

export class ProductInStockNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductInStockDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ProductInStockOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ProductInStockDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ProductInStock(requiredType: Required = Required.STRONG) {
    return ProductInStockDecoratorStrategy.variables(requiredType).getDecorator();
}
