import { IPropStrategy, Required } from '@inft-common/decorators';
import { EPaymentMethod } from '@inft-common/shared/enums/payment-method.enum';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';


export class PaymentMethodDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new PaymentMethodRequired())
            .set(Required.NULLABLE, new PaymentMethodNullable())
            .set(Required.OPTIONAL, new PaymentMethodOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: EPaymentMethod.APPLE_PAY,
                type: String,
                description: 'Payment method',
                enum: EPaymentMethod,
            }),
            IsNotEmpty(),
            IsEnum(EPaymentMethod),
        ];
    }
}

export class PaymentMethodRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PaymentMethodDecoratorStrategy.default(true),
        );
    }
}

export class PaymentMethodNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PaymentMethodDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class PaymentMethodOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PaymentMethodDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function PaymentMethod(requiredType: Required = Required.STRONG) {
    return PaymentMethodDecoratorStrategy.variables(requiredType).getDecorator();
}
