import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class AuthTokenDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new AuthTokenRequired())
            .set(Required.NULLABLE, new AuthTokenNullable())
            .set(Required.OPTIONAL, new AuthTokenOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: '$2b$10$JsJnMg3SCWwkCK91P0Ohx.aSn235kRfP82lZUupdrSB9KwaQay0ZG',
                type: String,
                description: 'Auth token',
            }),
            IsNotEmpty(),
            IsString(),
        ];
    }
}

export class AuthTokenRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...AuthTokenDecoratorStrategy.default(true),
        );
    }
}

export class AuthTokenNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...AuthTokenDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class AuthTokenOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...AuthTokenDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function AuthToken(requiredType: Required = Required.STRONG) {
    return AuthTokenDecoratorStrategy.variables(requiredType).getDecorator();
}
