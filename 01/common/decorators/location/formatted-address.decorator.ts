import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class FormattedAddressDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new FormattedAddressRequired())
            .set(Required.NULLABLE, new FormattedAddressNullable())
            .set(Required.OPTIONAL, new FormattedAddressOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Formatted address',
                type: String,
                description: 'Formatted address',
            }),
            IsString(),
            IsNotEmpty(),
        ];
    }
}

export class FormattedAddressRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FormattedAddressDecoratorStrategy.default(true),
        );
    }
}

export class FormattedAddressNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FormattedAddressDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class FormattedAddressOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FormattedAddressDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function FormattedAddress(requiredType: Required = Required.STRONG) {
    return FormattedAddressDecoratorStrategy.variables(requiredType).getDecorator();
}
