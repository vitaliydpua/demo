import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../index';

export class StreetDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new StreetRequired())
            .set(Required.NULLABLE, new StreetNullable())
            .set(Required.OPTIONAL, new StreetOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Street',
                type: String,
                description: 'Street',
            }),
            IsString(),
        ];
    }
}

export class StreetRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...StreetDecoratorStrategy.default(true),
        );
    }
}

export class StreetNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...StreetDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class StreetOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...StreetDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Street(requiredType: Required = Required.STRONG) {
    return StreetDecoratorStrategy.variables(requiredType).getDecorator();
}
