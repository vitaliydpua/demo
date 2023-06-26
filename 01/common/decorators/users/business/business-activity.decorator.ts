import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EBusinessActivity } from "@inft-common/shared/enums/business-activity.enum";


export class BusinessActivityDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new BusinessActivityRequired())
            .set(Required.NULLABLE, new BusinessActivityNullable())
            .set(Required.OPTIONAL, new BusinessActivityOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: EBusinessActivity.SWEETS,
                type: String,
                description: 'Business activity',
                enum: EBusinessActivity,
            }),
            IsNotEmpty(),
            IsEnum(EBusinessActivity),
        ];
    }
}

export class BusinessActivityRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...BusinessActivityDecoratorStrategy.default(true),
        );
    }
}

export class BusinessActivityNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...BusinessActivityDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class BusinessActivityOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...BusinessActivityDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function BusinessActivity(requiredType: Required = Required.STRONG) {
    return BusinessActivityDecoratorStrategy.variables(requiredType).getDecorator();
}
