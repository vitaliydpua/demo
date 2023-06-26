import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../../index';
import { ESimpleUserRestrictions } from "@inft-common/restrictions/user/simple-user.restrictions";

export class FirstNameDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new FirstNameRequired())
            .set(Required.NULLABLE, new FirstNameNullable())
            .set(Required.OPTIONAL, new FirstNameOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Firstname',
                type: String,
                description: 'Users first name',
                minLength: ESimpleUserRestrictions.FIRST_NAME_MIN,
                maxLength: ESimpleUserRestrictions.FIRST_NAME_MAX,
            }),
            MinLength(ESimpleUserRestrictions.FIRST_NAME_MIN),
            MaxLength(ESimpleUserRestrictions.FIRST_NAME_MAX),
            IsString(),
            IsNotEmpty(),
        ];
    }
}

export class FirstNameRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FirstNameDecoratorStrategy.default(true),
        );
    }
}

export class FirstNameNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FirstNameDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class FirstNameOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FirstNameDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function FirstName(requiredType: Required = Required.STRONG) {
    return FirstNameDecoratorStrategy.variables(requiredType).getDecorator();
}
