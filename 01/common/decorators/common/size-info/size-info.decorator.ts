import { IPropStrategy, Required } from '@inft-common/decorators';
import { SizeInfoDto } from '@inft-common/shared/dtos/size-info.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateIf, ValidateNested } from 'class-validator';



export class SizeInfoDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new SizeInfoRequired())
            .set(Required.NULLABLE, new SizeInfoNullable())
            .set(Required.OPTIONAL, new SizeInfoOptional());

        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: SizeInfoDto,
                description: 'Size info',
            }),
            ValidateNested(),
            Type(() => SizeInfoDto),
        ];
    }
}

export class SizeInfoRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SizeInfoDecoratorStrategy.default(true),
        );
    }
}

export class SizeInfoNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SizeInfoDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class SizeInfoOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...SizeInfoDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function SizeInfo(requiredType: Required = Required.STRONG) {
    return SizeInfoDecoratorStrategy.variables(requiredType).getDecorator();
}
