import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class PageDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new PageRequired())
            .set(Required.NULLABLE, new PageNullable())
            .set(Required.OPTIONAL, new PageOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: Number,
                description: 'Page',
                example: 0,
                minimum: 0,
            }),
            IsNotEmpty(),
            Type(() => Number),
            IsNumber(),
            Min(0),
        ];
    }
}

export class PageRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PageDecoratorStrategy.default(true),
        );
    }
}

export class PageNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PageDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class PageOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PageDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Page(requiredType: Required = Required.STRONG) {
    return PageDecoratorStrategy.variables(requiredType).getDecorator();
}
