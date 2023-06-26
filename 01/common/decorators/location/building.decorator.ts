import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from "class-validator";

import { IPropStrategy, Required } from '../index';

export class BuildingDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new BuildingRequired())
            .set(Required.NULLABLE, new BuildingNullable())
            .set(Required.OPTIONAL, new BuildingOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Building',
                type: String,
                description: 'Address - Building',
            }),
            IsString(),
        ];
    }
}

export class BuildingRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...BuildingDecoratorStrategy.default(true),
        );
    }
}

export class BuildingNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...BuildingDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class BuildingOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...BuildingDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Building(requiredType: Required = Required.STRONG) {
    return BuildingDecoratorStrategy.variables(requiredType).getDecorator();
}
