import { CreateProductDTO } from '@inft-app/products/controllers/dtos/products/create/create-product.dto';
import { Required } from '@inft-common/decorators';
import { SizeList } from '@inft-common/decorators/common/size-info/size-list.decorator';
import {
    RentRequirementsDecorator
} from '@inft-common/decorators/products/product-clothes/rent-requirements.decorator';
import {
    EProductClothesRestrictions
} from '@inft-common/restrictions/product/product-clothes/product-clothes.restrictions';
import { SizeInfoDto } from '@inft-common/shared/dtos/size-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max } from 'class-validator';

import { RentRequirements } from '../../../../../../core/products/entities/product-clothes.entity';

export class RentRequirementsDto implements RentRequirements {
    @ApiProperty()
    @IsNumber()
    @Max(EProductClothesRestrictions.MAX_DAYS)
    maxDays: number;

    @ApiProperty()
    @IsNumber()
    @Max(EProductClothesRestrictions.MIN_DAYS)
    minDays: number;
}
export class CreateProductClothesDto extends CreateProductDTO {
    @SizeList(Required.STRONG)
    sizes: SizeInfoDto[];

    @RentRequirementsDecorator(Required.STRONG)
    rentRequirements: RentRequirementsDto;
}
