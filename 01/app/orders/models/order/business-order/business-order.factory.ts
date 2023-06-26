import {
    BusinessOrderModel,
    BusinessOrderModelData,
} from '@inft-app/orders/models/order/business-order/business-order.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class BusinessOrderFactory extends ModelFactory<BusinessOrderModelData, BusinessOrderModel> {
    protected getInstance(): BusinessOrderModel {
        return new BusinessOrderModel();
    }
}
