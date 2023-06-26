import { EGeneralRestrictions } from '@inft-common/restrictions/general.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class SearchTextDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new SearchTextRequired())
            .set(Required.NULLABLE, new SearchTextNullable())
            .set(Required.OPTIONAL, new SearchTextOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: String,
                description: 'Search text',
                example: 'text',
                minLength: EGeneralRestrictions.MIN_SEARCH_TEXT_LENGTH,
                maxLength: EGeneralRestrictions.MAX_SEARCH_TEXT_LENGTH,
            }),
            IsString(),
            IsNotEmpty(),
            MinLength(EGeneralRestrictions.MIN_SEARCH_TEXT_LENGTH),
            MaxLength(EGeneralRestrictions.MAX_SEARCH_TEXT_LENGTH),
            Type(() => String),
        ];
    }
}

export class SearchTextRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SearchTextDecoratorStrategy.default(true),
        );
    }
}

export class SearchTextNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SearchTextDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class SearchTextOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SearchTextDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function SearchText(requiredType: Required = Required.STRONG) {
    return SearchTextDecoratorStrategy.variables(requiredType).getDecorator();
}
