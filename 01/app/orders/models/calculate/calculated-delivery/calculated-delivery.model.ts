import {
    CalculatedDeliveryLocationModel
} from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery-location/calculated-delivery-location.model';

export interface CalculatedDeliveryModelData {
    location: CalculatedDeliveryLocationModel;
    price: number;
    activeDate: number;
    activeDateFormat: string;
    deliveries: string[];
}

export interface CalculatedDeliveryModel extends CalculatedDeliveryModelData {}

export class CalculatedDeliveryModel {}
