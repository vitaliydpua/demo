import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";


import { IPropStrategy, Required } from '../../index';
import { ESimpleUserRestrictions } from "@inft-common/restrictions/user/simple-user.restrictions";

export class LastNameDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new LastNameRequired())
            .set(Required.NULLABLE, new LastNameNullable())
            .set(Required.OPTIONAL, new LastNameOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Lastname',
                type: String,
                description: 'Users last name',
                minLength: ESimpleUserRestrictions.LAST_NAME_MIN,
                maxLength: ESimpleUserRestrictions.LAST_NAME_MAX,
            }),
            MinLength(ESimpleUserRestrictions.LAST_NAME_MIN),
            MaxLength(ESimpleUserRestrictions.LAST_NAME_MAX),
            IsString(),
            IsNotEmpty(),
        ];
    }
}

export class LastNameRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LastNameDecoratorStrategy.default(true),
        );
    }
}

export class LastNameNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LastNameDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class LastNameOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LastNameDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function LastName(requiredType: Required = Required.STRONG) {
    return LastNameDecoratorStrategy.variables(requiredType).getDecorator();
}
