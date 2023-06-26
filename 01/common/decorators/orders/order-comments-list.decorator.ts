import { OrderNoteDto } from '@inft-app/orders/controllers/dtos/create-order/order-note.dto';
import { IPropStrategy, Required } from '@inft-common/decorators';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, ValidateIf, ValidateNested } from 'class-validator';


export class OrderCommentsListDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new OrderCommentsListRequired())
            .set(Required.NULLABLE, new OrderCommentsListNullable())
            .set(Required.OPTIONAL, new OrderCommentsListOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: OrderNoteDto,
                description: 'List of notes',
                isArray: true,
            }),
            IsArray(),
            ArrayNotEmpty(),
            ValidateNested({ each: true }),
            Type(() => OrderNoteDto),
        ];
    }
}

export class OrderCommentsListRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...OrderCommentsListDecoratorStrategy.default(true),
        );
    }
}

export class OrderCommentsListNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...OrderCommentsListDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class OrderCommentsListOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...OrderCommentsListDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function OrderCommentsList(requiredType: Required = Required.STRONG) {
    return OrderCommentsListDecoratorStrategy.variables(requiredType).getDecorator();
}
