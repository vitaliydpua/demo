import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IPropStrategy, Required } from "@inft-common/decorators";
import { EBusinessUserRestrictions } from "@inft-common/restrictions/user/business-user.restrictions";


export class CompanyDescriptionDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new CompanyDescriptionRequired())
            .set(Required.NULLABLE, new CompanyDescriptionNullable())
            .set(Required.OPTIONAL, new CompanyDescriptionOptional());
        return map.get(requiredType)!;
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                example: 'Some company description',
                type: String,
                description: 'Description',
                minLength: EBusinessUserRestrictions.DESCRIPTION_MIN,
                maxLength: EBusinessUserRestrictions.DESCRIPTION_MAX,
            }),
            IsString(),
            MinLength(EBusinessUserRestrictions.DESCRIPTION_MIN),
            MaxLength(EBusinessUserRestrictions.DESCRIPTION_MAX),
        ];
    }
}

export class CompanyDescriptionRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CompanyDescriptionDecoratorStrategy.default(true),
        );
    }
}

export class CompanyDescriptionNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CompanyDescriptionDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class CompanyDescriptionOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...CompanyDescriptionDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function CompanyDescription(requiredType: Required = Required.STRONG) {
    return CompanyDescriptionDecoratorStrategy.variables(requiredType).getDecorator();
}
