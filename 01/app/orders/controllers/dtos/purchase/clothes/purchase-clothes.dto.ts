import { PurchaseDto } from '@inft-app/orders/controllers/dtos/purchase/purchase.dto';
import { Required } from '@inft-common/decorators';
import { SizeInfo } from '@inft-common/decorators/common/size-info/size-info.decorator';
import { SizeInfoDto } from '@inft-common/shared/dtos/size-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class PurchaseAdditionalClothesDto {
    @SizeInfo(Required.STRONG)
    size: SizeInfoDto;
}

export class PurchaseClothesDto extends PurchaseDto {
    @ApiProperty({ type: PurchaseAdditionalClothesDto, required: true })
    @ValidateNested()
    @Type(() => PurchaseAdditionalClothesDto)
    options: PurchaseAdditionalClothesDto;
}
