import { EReviewRestrictions } from '@inft-common/restrictions/review/review.restrictions';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class ReviewRatingDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ReviewRatingRequired())
            .set(Required.NULLABLE, new ReviewRatingNullable())
            .set(Required.OPTIONAL, new ReviewRatingOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: Number,
                description: 'Rating',
                minimum: EReviewRestrictions.VALUE_MIN,
                maximum: EReviewRestrictions.VALUE_MAX,
                example: EReviewRestrictions.VALUE_MIN,
            }),
            IsNumber(),
            Type(() => Number),
            Max(EReviewRestrictions.VALUE_MAX),
            Min(EReviewRestrictions.VALUE_MIN),
        ];
    }
}

export class ReviewRatingRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ReviewRatingDecoratorStrategy.default(true),
        );
    }
}

export class ReviewRatingNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ReviewRatingDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ReviewRatingOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ReviewRatingDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ReviewRating(requiredType: Required = Required.STRONG) {
    return ReviewRatingDecoratorStrategy.variables(requiredType).getDecorator();
}
