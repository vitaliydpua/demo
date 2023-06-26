import { IPropStrategy, Required } from '@inft-common/decorators';
import { ECategoryRestrictions } from '@inft-common/restrictions/category/category.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';


export class CategoryPositionDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new CategoryPositionRequired())
            .set(Required.NULLABLE, new CategoryPositionNullable())
            .set(Required.OPTIONAL, new CategoryPositionOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: Number,
                description: 'Position',
                minimum: ECategoryRestrictions.POSITION_MIN,
                maximum: ECategoryRestrictions.POSITION_MAX,
                example: 0,
            }),
            IsNotEmpty(),
            Type(() => Number),
            IsNumber(),
            Max(ECategoryRestrictions.POSITION_MAX),
            Min(ECategoryRestrictions.POSITION_MIN),
        ];
    }
}

export class CategoryPositionRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CategoryPositionDecoratorStrategy.default(true),
        );
    }
}

export class CategoryPositionNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CategoryPositionDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class CategoryPositionOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CategoryPositionDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function CategoryPosition(requiredType: Required = Required.STRONG) {
    return CategoryPositionDecoratorStrategy.variables(requiredType).getDecorator();
}
