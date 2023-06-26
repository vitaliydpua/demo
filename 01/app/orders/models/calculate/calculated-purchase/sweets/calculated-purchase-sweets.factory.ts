import {
    CalculatedPurchaseSweetsModel, CalculatedPurchaseSweetsModelData,
} from '@inft-app/orders/models/calculate/calculated-purchase/sweets/calculated-purchase-sweets.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class CalculatedPurchaseSweetsFactory extends ModelFactory<CalculatedPurchaseSweetsModelData, CalculatedPurchaseSweetsModel> {
    protected getInstance(): CalculatedPurchaseSweetsModel {
        return new CalculatedPurchaseSweetsModel();
    }
}
