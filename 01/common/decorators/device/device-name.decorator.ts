import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class DeviceNameDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new DeviceNameRequired())
            .set(Required.NULLABLE, new DeviceNameNullable())
            .set(Required.OPTIONAL, new DeviceNameOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'iPhone12,5',
                type: String,
                description: 'Device name',
            }),
            IsNotEmpty(),
            IsString(),
        ];
    }
}

export class DeviceNameRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceNameDecoratorStrategy.default(true),
        );
    }
}

export class DeviceNameNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceNameDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class DeviceNameOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceNameDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function DeviceName(requiredType: Required = Required.STRONG) {
    return DeviceNameDecoratorStrategy.variables(requiredType).getDecorator();
}
