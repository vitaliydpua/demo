import { RentRequirementsDto } from '@inft-app/products/controllers/dtos/products/create/create-product-clothes.dto';
import { IPropStrategy, Required } from '@inft-common/decorators';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateIf, ValidateNested } from 'class-validator';

export class RentRequirementsDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new RentRequirementsRequired())
            .set(Required.NULLABLE, new RentRequirementsNullable())
            .set(Required.OPTIONAL, new RentRequirementsOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: RentRequirementsDto,
                description: 'Rent requirements',
            }),
            ValidateNested(),
            Type(() => RentRequirementsDto),
        ];
    }
}

export class RentRequirementsRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...RentRequirementsDecoratorStrategy.default(true),
        );
    }
}

export class RentRequirementsNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...RentRequirementsDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class RentRequirementsOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...RentRequirementsDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function RentRequirementsDecorator(requiredType: Required = Required.STRONG) {
    return RentRequirementsDecoratorStrategy.variables(requiredType).getDecorator();
}
