import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class DeviceIdentifierDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new DeviceIdentifierRequired())
            .set(Required.NULLABLE, new DeviceIdentifierNullable())
            .set(Required.OPTIONAL, new DeviceIdentifierOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'e60fac865c0e5ffb',
                type: String,
                description: 'Device Identifier',
            }),
            IsNotEmpty(),
            IsString(),
        ];
    }
}

export class DeviceIdentifierRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceIdentifierDecoratorStrategy.default(true),
        );
    }
}

export class DeviceIdentifierNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceIdentifierDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class DeviceIdentifierOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceIdentifierDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function DeviceIdentifier(requiredType: Required = Required.STRONG) {
    return DeviceIdentifierDecoratorStrategy.variables(requiredType).getDecorator();
}
