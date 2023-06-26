import { LocationAddressDto } from '@inft-app/locations/controllers/dtos/location-address.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf, ValidateNested } from 'class-validator';


import { IPropStrategy, Required } from '../index';

export class LocationAddressDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new LocationAddressRequired())
            .set(Required.NULLABLE, new LocationAddressNullable())
            .set(Required.OPTIONAL, new LocationAddressOptional());
        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: LocationAddressDto,
            }),
            ValidateNested(),
            IsNotEmpty(),
            Type(() => LocationAddressDto),
        ];
    }
}

export class LocationAddressRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LocationAddressDecoratorStrategy.default(true),
        );
    }
}

export class LocationAddressNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LocationAddressDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class LocationAddressOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...LocationAddressDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function LocationAddress(requiredType: Required = Required.STRONG) {
    return LocationAddressDecoratorStrategy.variables(requiredType).getDecorator();
}
