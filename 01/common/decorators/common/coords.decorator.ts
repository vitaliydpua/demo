import { CoordsDto } from '@inft-common/shared/dtos/coords.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf, ValidateNested } from 'class-validator';


import { IPropStrategy, Required } from '../index';

export class CoordsDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new CoordsRequired())
            .set(Required.NULLABLE, new CoordsNullable())
            .set(Required.OPTIONAL, new CoordsOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: CoordsDto,
            }),
            ValidateNested(),
            IsNotEmpty(),
            Type(() => CoordsDto),
        ];
    }
}

export class CoordsRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CoordsDecoratorStrategy.default(true),
        );
    }
}

export class CoordsNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CoordsDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class CoordsOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CoordsDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Coords(requiredType: Required = Required.STRONG) {
    return CoordsDecoratorStrategy.variables(requiredType).getDecorator();
}
