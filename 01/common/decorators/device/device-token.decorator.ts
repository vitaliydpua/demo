import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class DeviceTokenDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new DeviceTokenRequired())
            .set(Required.NULLABLE, new DeviceTokenNullable())
            .set(Required.OPTIONAL, new DeviceTokenOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'iRiDRLDDOQsrqpCVhK21',
                type: String,
                description: 'Device token',
            }),
            IsNotEmpty(),
            IsString(),
        ];
    }
}

export class DeviceTokenRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceTokenDecoratorStrategy.default(true),
        );
    }
}

export class DeviceTokenNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceTokenDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class DeviceTokenOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DeviceTokenDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function DeviceToken(requiredType: Required = Required.STRONG) {
    return DeviceTokenDecoratorStrategy.variables(requiredType).getDecorator();
}
