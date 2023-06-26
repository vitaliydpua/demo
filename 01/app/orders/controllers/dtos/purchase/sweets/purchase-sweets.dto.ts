import { PurchaseDto } from '@inft-app/orders/controllers/dtos/purchase/purchase.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class PurchaseAdditionalSweetsDto {}

export class PurchaseSweetsDto extends PurchaseDto {
    @ApiProperty({ type: PurchaseAdditionalSweetsDto, required: true })
    @ValidateNested()
    @Type(() => PurchaseAdditionalSweetsDto)
    options: PurchaseAdditionalSweetsDto;
}
