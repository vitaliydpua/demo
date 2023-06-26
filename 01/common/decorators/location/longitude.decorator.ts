import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsLongitude, IsOptional, ValidateIf, NotEquals } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class LongitudeDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new LongitudeRequired())
            .set(Required.NULLABLE, new LongitudeNullable())
            .set(Required.OPTIONAL, new LongitudeOptional());
        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 11.586301638766539,
                type: Number,
                description: 'Address - Longitude',
            }),
            IsLongitude(),
            NotEquals(0),
        ];
    }
}

export class LongitudeRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LongitudeDecoratorStrategy.default(true),
        );
    }
}

export class LongitudeNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LongitudeDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class LongitudeOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LongitudeDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Longitude(requiredType: Required = Required.STRONG) {
    return LongitudeDecoratorStrategy.variables(requiredType).getDecorator();
}
