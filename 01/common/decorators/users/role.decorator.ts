import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EUserRole } from "@inft-common/shared/enums/user-role.enum";


export class RoleDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new RoleRequired())
            .set(Required.NULLABLE, new RoleNullable())
            .set(Required.OPTIONAL, new RoleOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: EUserRole.USER,
                type: String,
                description: 'Role name',
                enum: EUserRole,
            }),
            IsNotEmpty(),
            IsEnum(EUserRole),
        ];
    }
}

export class RoleRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...RoleDecoratorStrategy.default(true),
        );
    }
}

export class RoleNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...RoleDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class RoleOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...RoleDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function Role(requiredType: Required = Required.STRONG) {
    return RoleDecoratorStrategy.variables(requiredType).getDecorator();
}
