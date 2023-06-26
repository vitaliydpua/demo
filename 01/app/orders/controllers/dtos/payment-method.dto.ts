import { Required } from '@inft-common/decorators';
import { PaymentMethod } from '@inft-common/decorators/common/payment-method.decorator';
import { EPaymentMethod } from '@inft-common/shared/enums/payment-method.enum';

export class PaymentDto {
    @PaymentMethod(Required.STRONG)
    method: EPaymentMethod;
}
