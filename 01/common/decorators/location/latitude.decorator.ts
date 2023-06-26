import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsNotEmpty, IsOptional, NotEquals, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class LatitudeDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new LatitudeRequired())
            .set(Required.NULLABLE, new LatitudeNullable())
            .set(Required.OPTIONAL, new LatitudeOptional());
        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 32.79371782950056,
                type: Number,
                description: 'Address - Latitude',
            }),
            IsLatitude(),
            NotEquals(0),
        ];
    }
}

export class LatitudeRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LatitudeDecoratorStrategy.default(true),
        );
    }
}

export class LatitudeNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LatitudeDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class LatitudeOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LatitudeDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Latitude(requiredType: Required = Required.STRONG) {
    return LatitudeDecoratorStrategy.variables(requiredType).getDecorator();
}
