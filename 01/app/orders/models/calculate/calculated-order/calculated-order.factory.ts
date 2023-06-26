import {
    CalculatedOrderModel,
    CalculatedOrderModelData
} from '@inft-app/orders/models/calculate/calculated-order/calculated-order.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class CalculatedOrderFactory extends ModelFactory<CalculatedOrderModelData, CalculatedOrderModel> {
    protected getInstance(): CalculatedOrderModel {
        return new CalculatedOrderModel();
    }
}
