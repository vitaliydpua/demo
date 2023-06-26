import { PurchaseModel, PurchaseModelData } from '@inft-app/orders/models/order/business-order/purchase/purchase.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class PurchaseFactory extends ModelFactory<PurchaseModelData, PurchaseModel> {
    protected getInstance(): PurchaseModel {
        return new PurchaseModel();
    }
}
