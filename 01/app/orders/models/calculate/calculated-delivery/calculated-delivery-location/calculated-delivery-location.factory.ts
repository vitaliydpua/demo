import {
    CalculatedDeliveryLocationModel,
    CalculatedDeliveryLocationModelData
} from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery-location/calculated-delivery-location.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class CalculatedDeliveryLocationFactory extends
    ModelFactory<CalculatedDeliveryLocationModelData, CalculatedDeliveryLocationModel> {
    protected getInstance(): CalculatedDeliveryLocationModel {
        return new CalculatedDeliveryLocationModel();
    }
}
