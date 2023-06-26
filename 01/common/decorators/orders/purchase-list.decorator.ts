import { PurchaseClothesDto } from '@inft-app/orders/controllers/dtos/purchase/clothes/purchase-clothes.dto';
import { PurchaseDto } from '@inft-app/orders/controllers/dtos/purchase/purchase.dto';
import { PurchaseSweetsDto } from '@inft-app/orders/controllers/dtos/purchase/sweets/purchase-sweets.dto';
import { IPropStrategy, Required } from '@inft-common/decorators';
import { EBusinessActivity } from '@inft-common/shared/enums/business-activity.enum';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, ValidateIf, ValidateNested } from 'class-validator';


export class PurchaseListDecoratorStrategy {
    static variables(requiredType: Required): IPropStrategy {
        const map = new Map<Required, IPropStrategy>()
            .set(Required.STRONG, new PurchaseListRequired())
            .set(Required.NULLABLE, new PurchaseListNullable())
            .set(Required.OPTIONAL, new PurchaseListOptional());
        return map.get(requiredType);
    }

    static default(required: boolean): PropertyDecorator[] {
        return [
            ApiProperty({
                required,
                type: PurchaseDto,
                isArray: true,
                description: 'List of purchases',
            }),
            IsArray(),
            ValidateNested({ each: true }),
            ArrayNotEmpty(),
            Type(() => PurchaseDto, {
                keepDiscriminatorProperty: true,
                discriminator: {
                    property: 'type',
                    subTypes: [
                        {
                            name: EBusinessActivity.CLOTHES,
                            value: PurchaseClothesDto,
                        },
                        {
                            name: EBusinessActivity.SWEETS,
                            value: PurchaseSweetsDto,
                        },
                    ]
                },
            })
        ];
    }
}

export class PurchaseListRequired implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PurchaseListDecoratorStrategy.default(true),
        );
    }
}

export class PurchaseListNullable implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PurchaseListDecoratorStrategy.default(false),
            IsOptional(),
            ValidateIf((object, value) => value !== null),
        );
    }
}

export class PurchaseListOptional implements IPropStrategy {
    getDecorator(): Function {
        return applyDecorators(
            ...PurchaseListDecoratorStrategy.default(false),
            ValidateIf((object, value) => value !== undefined),
        );
    }
}

export function PurchaseList(requiredType: Required = Required.STRONG) {
    return PurchaseListDecoratorStrategy.variables(requiredType).getDecorator();
}
