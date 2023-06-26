import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../index';

export class CityDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new CityRequired())
            .set(Required.NULLABLE, new CityNullable())
            .set(Required.OPTIONAL, new CityOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'New York',
                type: String,
                description: 'City',
            }),
            IsString(),
            IsNotEmpty(),
        ];
    }
}

export class CityRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CityDecoratorStrategy.default(true),
        );
    }
}

export class CityNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CityDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class CityOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CityDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function City(requiredType: Required = Required.STRONG) {
    return CityDecoratorStrategy.variables(requiredType).getDecorator();
}
