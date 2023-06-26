import {
    CalculatedPurchaseModel,
    CalculatedPurchaseModelData
} from '@inft-app/orders/models/calculate/calculated-purchase/calculated-purchase.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class CalculatedPurchaseFactory extends ModelFactory<CalculatedPurchaseModelData, CalculatedPurchaseModel> {
    protected getInstance(): CalculatedPurchaseModel {
        return new CalculatedPurchaseModel();
    }
}
