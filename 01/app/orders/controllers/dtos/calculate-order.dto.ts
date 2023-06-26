import { LocationAddressDto } from '@inft-app/locations/controllers/dtos/location-address.dto';
import { PaymentDto } from '@inft-app/orders/controllers/dtos/payment-method.dto';
import { PurchaseClothesDto } from '@inft-app/orders/controllers/dtos/purchase/clothes/purchase-clothes.dto';
import { PurchaseSweetsDto } from '@inft-app/orders/controllers/dtos/purchase/sweets/purchase-sweets.dto';
import { Required } from '@inft-common/decorators';
import { LocationAddress } from '@inft-common/decorators/location/location-address.decorator';
import { PurchaseList } from '@inft-common/decorators/orders/purchase-list.decorator';
import { Payment } from '@inft-common/decorators/payments/payment.decorator';
import { IsDateString, IsOptional } from 'class-validator';

export class CalculateOrderDto {
    @LocationAddress(Required.OPTIONAL)
    deliveryLocation?: LocationAddressDto;

    @PurchaseList(Required.STRONG)
    purchases: Array<PurchaseClothesDto | PurchaseSweetsDto>;

    @IsOptional()
    @IsDateString()
    deliveryDate: string | null;

    @Payment(Required.NULLABLE)
    payment: PaymentDto | null;
}
