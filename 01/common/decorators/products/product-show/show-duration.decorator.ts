import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    Max,
    Min,
    ValidateIf,
} from 'class-validator';
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EProductShowRestrictions } from '@inft-common/restrictions/product/product-show/product-show.restrictions';
import { Type } from 'class-transformer';


export class ShowDurationDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ShowDurationRequired())
            .set(Required.NULLABLE, new ShowDurationNullable())
            .set(Required.OPTIONAL, new ShowDurationOptional());
        return <IPropStrategy>map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: '100',
                type: String,
                description: 'Duration of the show in minutes',
                minLength: EProductShowRestrictions.DURATION_MIN,
                maxLength: EProductShowRestrictions.DURATION_MAX,
            }),
            Min(EProductShowRestrictions.DURATION_MIN),
            Max(EProductShowRestrictions.DURATION_MAX),
            IsNumber(),
            Type(() => Number),
        ];
    }
}

export class ShowDurationRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ShowDurationDecoratorStrategy.default(true),
        );
    }
}

export class ShowDurationNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ShowDurationDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ShowDurationOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ShowDurationDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ShowDuration(requiredType: Required = Required.STRONG) {
    return ShowDurationDecoratorStrategy.variables(requiredType).getDecorator();
}
