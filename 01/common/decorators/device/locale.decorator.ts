import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

import { ELocale } from '../../shared/enums/locale.enum';

import { IPropStrategy, Required } from '../index';

export class LocaleDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new LocaleRequired())
            .set(Required.NULLABLE, new LocaleNullable())
            .set(Required.OPTIONAL, new LocaleOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: ELocale.EN,
                type: String,
                description: 'Locale',
                enum: ELocale,
            }),
            IsNotEmpty(),
            IsEnum(ELocale),
        ];
    }
}

export class LocaleRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LocaleDecoratorStrategy.default(true),
        );
    }
}

export class LocaleNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LocaleDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class LocaleOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LocaleDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Locale(requiredType: Required = Required.STRONG) {
    return LocaleDecoratorStrategy.variables(requiredType).getDecorator();
}
