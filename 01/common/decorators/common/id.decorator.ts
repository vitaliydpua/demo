import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class IdDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new IdRequired())
            .set(Required.NULLABLE, new IdNullable())
            .set(Required.OPTIONAL, new IdOptional());
        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: String,
                description: 'ID',
                example: '123e4567-e89b-12d3-a456-426614174000',
            }),
            IsUUID(),
            Type(() => String),
        ];
    }
}

export class IdRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...IdDecoratorStrategy.default(true),
        );
    }
}

export class IdNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...IdDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class IdOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...IdDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Id(requiredType: Required = Required.STRONG) {
    return IdDecoratorStrategy.variables(requiredType).getDecorator();
}
