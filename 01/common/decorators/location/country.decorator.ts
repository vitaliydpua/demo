import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../index';

export class CountryDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new CountryRequired())
            .set(Required.NULLABLE, new CountryNullable())
            .set(Required.OPTIONAL, new CountryOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'USA',
                type: String,
                description: 'Country',
            }),
            IsString(),
            IsNotEmpty(),
        ];
    }
}

export class CountryRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CountryDecoratorStrategy.default(true),
        );
    }
}

export class CountryNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CountryDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class CountryOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CountryDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Country(requiredType: Required = Required.STRONG) {
    return CountryDecoratorStrategy.variables(requiredType).getDecorator();
}
