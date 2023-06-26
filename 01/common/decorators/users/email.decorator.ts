import { ECommonRestrictions } from '@inft-common/shared/utils/restrictions/common-restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class EmailDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new EmailRequired())
            .set(Required.NULLABLE, new EmailNullable())
            .set(Required.OPTIONAL, new EmailOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'test@gmail.com',
                type: String,
                description: 'email',
            }),
            IsNotEmpty(),
            IsEmail(),
            MaxLength(ECommonRestrictions.EmailMaxLength),
            Transform(({ value }) => value ? value.toLowerCase() : undefined),
        ];
    }
}

export class EmailRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...EmailDecoratorStrategy.default(true),
        );
    }
}

export class EmailNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...EmailDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class EmailOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...EmailDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Email(requiredType: Required = Required.STRONG) {
    return EmailDecoratorStrategy.variables(requiredType).getDecorator();
}
