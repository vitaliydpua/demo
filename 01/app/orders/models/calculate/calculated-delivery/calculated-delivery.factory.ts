import {
    CalculatedDeliveryModel,
    CalculatedDeliveryModelData
} from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class CalculatedDeliveryFactory extends ModelFactory<CalculatedDeliveryModelData, CalculatedDeliveryModel> {
    protected getInstance(): CalculatedDeliveryModel {
        return new CalculatedDeliveryModel();
    }
}
