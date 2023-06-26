import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class FcmTokenDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new FcmTokenRequired())
            .set(Required.NULLABLE, new FcmTokenNullable())
            .set(Required.OPTIONAL, new FcmTokenOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'c2aK9KHmw8E:APA91bF7MY9bNnvGAXgbHN58lyDxc9KnuXNXwsqU' +
                    's4uV4GyeF06HM1hMm-etu63S_4C-GnEtHAxJPJJC4H__VcIk90A69qQz65to' +
                    'Fejxyncceg0_j5xwoFWvPQ5pzKo69rUnuCl1GSSv',
                type: String,
                description: 'FCM token',
            }),
            IsNotEmpty(),
            IsString(),
        ];
    }
}

export class FcmTokenRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FcmTokenDecoratorStrategy.default(true),
        );
    }
}

export class FcmTokenNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FcmTokenDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class FcmTokenOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...FcmTokenDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function FcmToken(requiredType: Required = Required.STRONG) {
    return FcmTokenDecoratorStrategy.variables(requiredType).getDecorator();
}
