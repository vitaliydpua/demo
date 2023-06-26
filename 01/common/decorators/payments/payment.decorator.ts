import { PaymentDto } from '@inft-app/orders/controllers/dtos/payment-method.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf, ValidateNested } from 'class-validator';

import { IPropStrategy, Required } from '../index';

export class PaymentDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new PaymentRequired())
            .set(Required.NULLABLE, new PaymentNullable())
            .set(Required.OPTIONAL, new PaymentOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: PaymentDto,
                description: 'Payment',
            }),
            ValidateNested(),
            IsNotEmpty(),
            Type(() => PaymentDto),
        ];
    }
}

export class PaymentRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PaymentDecoratorStrategy.default(true),
        );
    }
}

export class PaymentNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PaymentDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class PaymentOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PaymentDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Payment(requiredType: Required = Required.STRONG) {
    return PaymentDecoratorStrategy.variables(requiredType).getDecorator();
}
