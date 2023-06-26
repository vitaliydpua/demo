import { OrderModel, OrderModelData } from '@inft-app/orders/models/order/order.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class OrderFactory extends ModelFactory<OrderModelData, OrderModel> {
    protected getInstance(): OrderModel {
        return new OrderModel();
    }
}
