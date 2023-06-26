import { LocationModel } from '@inft-app/locations/models/location.model';
import { CalculatedDeliveryModel } from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery.model';
import { CalculatedPurchaseModel } from '@inft-app/orders/models/calculate/calculated-purchase/calculated-purchase.model';
import { PaymentModel } from '@inft-app/payments/models/payment.model';
import { BusinessUserShortModel } from '@inft-app/users/models/business-user-short/business-user-short.model';

export interface CalculatedOrderModelData {
    activeDelivery: CalculatedDeliveryModel;
    locations: LocationModel[];
    activePayment: PaymentModel | null;
    purchases: { [businessId: string]: CalculatedPurchaseModel[] };
    businesses: BusinessUserShortModel[];
}

export interface CalculatedOrderModel extends CalculatedOrderModelData {}

export class CalculatedOrderModel {}
