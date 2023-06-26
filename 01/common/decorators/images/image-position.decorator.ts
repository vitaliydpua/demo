import { EImagesRestrictions } from '@inft-common/restrictions/images/images.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class ImagePositionDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ImagePositionRequired())
            .set(Required.NULLABLE, new ImagePositionNullable())
            .set(Required.OPTIONAL, new ImagePositionOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: Number,
                description: 'Position',
                minimum: EImagesRestrictions.MIN_POSITION,
                maximum: EImagesRestrictions.MAX_POSITION,
                example: 0,
            }),
            IsNotEmpty(),
            Type(() => Number),
            IsNumber(),
            Max(EImagesRestrictions.MAX_POSITION),
            Min(EImagesRestrictions.MIN_POSITION),
        ];
    }
}

export class ImagePositionRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ImagePositionDecoratorStrategy.default(true),
        );
    }
}

export class ImagePositionNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ImagePositionDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ImagePositionOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ImagePositionDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ImagePosition(requiredType: Required = Required.STRONG) {
    return ImagePositionDecoratorStrategy.variables(requiredType).getDecorator();
}
