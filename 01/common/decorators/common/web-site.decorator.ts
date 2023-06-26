import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class WebSiteDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new WebSiteRequired())
            .set(Required.NULLABLE, new WebSiteNullable())
            .set(Required.OPTIONAL, new WebSiteOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: String,
                description: 'Web site URL',
                example: 'http://web-site.com',
            }),
            IsUrl(),
            Type(() => String),
        ];
    }
}

export class WebSiteRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...WebSiteDecoratorStrategy.default(true),
        );
    }
}

export class WebSiteNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...WebSiteDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class WebSiteOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...WebSiteDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function WebSite(requiredType: Required = Required.STRONG) {
    return WebSiteDecoratorStrategy.variables(requiredType).getDecorator();
}
