import { EReviewRestrictions } from '@inft-common/restrictions/review/review.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class ReviewCommentDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ReviewCommentRequired())
            .set(Required.NULLABLE, new ReviewCommentNullable())
            .set(Required.OPTIONAL, new ReviewCommentOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: String,
                description: 'Comment',
                minLength: EReviewRestrictions.TEXT_MIN,
                maxLength: EReviewRestrictions.TEXT_MAX,
                example: EReviewRestrictions.TEXT_MIN,
            }),
            IsNotEmpty(),
            IsString(),
            Type(() => String),
            MinLength(EReviewRestrictions.TEXT_MIN),
            MaxLength(EReviewRestrictions.TEXT_MAX),
        ];
    }
}

export class ReviewCommentRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ReviewCommentDecoratorStrategy.default(true),
        );
    }
}

export class ReviewCommentNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ReviewCommentDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ReviewCommentOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ReviewCommentDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ReviewComment(requiredType: Required = Required.STRONG) {
    return ReviewCommentDecoratorStrategy.variables(requiredType).getDecorator();
}
