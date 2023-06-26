import { IPropStrategy, Required } from '@inft-common/decorators';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID, ValidateIf } from 'class-validator';


export class ListIdsDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new ListIdsRequired())
            .set(Required.NULLABLE, new ListIdsNullable())
            .set(Required.OPTIONAL, new ListIdsOptional());
        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: String,
                description: 'UUIDs',
                isArray: true,
                example: [
                    '19ffe92a-ed62-4f02-a98f-91692f4812dc',
                    '29ffe92a-ed62-4f02-a98f-91692f4812dc',
                    '39ffe92a-ed62-4f02-a98f-91692f4812dc',
                ],
            }),
            IsArray(),
            IsUUID(undefined, { each: true }),
        ];
    }
}

export class ListIdsRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ListIdsDecoratorStrategy.default(true),
        );
    }
}

export class ListIdsNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ListIdsDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class ListIdsOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...ListIdsDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function ListIds(requiredType: Required = Required.STRONG) {
    return ListIdsDecoratorStrategy.variables(requiredType).getDecorator();
}
