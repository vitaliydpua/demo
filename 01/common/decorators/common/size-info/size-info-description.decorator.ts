import { IPropStrategy, Required } from '@inft-common/decorators';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';


export class SizeInfoDescriptionDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new SizeInfoDescriptionRequired())
            .set(Required.NULLABLE, new SizeInfoDescriptionNullable())
            .set(Required.OPTIONAL, new SizeInfoDescriptionOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: String,
            }),
            IsString(),
            IsNotEmpty(),
            Type(() => String),
        ];
    }
}

export class SizeInfoDescriptionRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SizeInfoDescriptionDecoratorStrategy.default(true),
        );
    }
}

export class SizeInfoDescriptionNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SizeInfoDescriptionDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class SizeInfoDescriptionOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SizeInfoDescriptionDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function SizeInfoDescription(requiredType: Required = Required.STRONG) {
    return SizeInfoDescriptionDecoratorStrategy.variables(requiredType).getDecorator();
}
