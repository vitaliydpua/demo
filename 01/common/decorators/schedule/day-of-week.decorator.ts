import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EDayOfWeek } from "@inft-common/shared/enums/day-of-week.enum";


export class DayOfWeekDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new DayOfWeekRequired())
            .set(Required.NULLABLE, new DayOfWeekNullable())
            .set(Required.OPTIONAL, new DayOfWeekOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: EDayOfWeek.MONDAY,
                type: String,
                description: 'Day of week',
                enum: EDayOfWeek,
            }),
            IsNotEmpty(),
            IsEnum(EDayOfWeek),
        ];
    }
}

export class DayOfWeekRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DayOfWeekDecoratorStrategy.default(true),
        );
    }
}

export class DayOfWeekNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DayOfWeekDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class DayOfWeekOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...DayOfWeekDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function DayOfWeek(requiredType: Required = Required.STRONG) {
    return DayOfWeekDecoratorStrategy.variables(requiredType).getDecorator();
}
