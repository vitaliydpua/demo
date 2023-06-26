import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class PostalCodeDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new PostalCodeRequired())
            .set(Required.NULLABLE, new PostalCodeNullable())
            .set(Required.OPTIONAL, new PostalCodeOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: '01000',
                type: String,
                description: 'postal code',
            }),
            IsString(),
        ];
    }
}

export class PostalCodeRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PostalCodeDecoratorStrategy.default(true),
        );
    }
}

export class PostalCodeNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PostalCodeDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class PostalCodeOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PostalCodeDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function PostalCode(requiredType: Required = Required.STRONG) {
    return PostalCodeDecoratorStrategy.variables(requiredType).getDecorator();
}
