import { LocationFactory } from '@inft-app/locations/models/location.factory';
import { LocationMapper } from '@inft-app/locations/models/location.mapper';
import { BusinessOrderFactory } from '@inft-app/orders/models/order/business-order/business-order.factory';
import { BusinessOrderMapper } from '@inft-app/orders/models/order/business-order/business-order.mapper';
import { OrderModelData } from '@inft-app/orders/models/order/order.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';

import { OrderEntity } from '../../../../core/orders/entities/order.entity';

export class OrderMapper extends ModelDataMapper<OrderEntity, OrderModelData> {
    mapData(data: OrderEntity): OrderModelData {
        return {
            id: data.id,
            deliveryAddress: new LocationFactory().getModelFromData(
                new LocationMapper().mapData(data.deliveryAddress)
            ),
            deliveryDate: data.deliveryDate,
            name: data.name,
            userId: data.userId,
            orders: (data.businessOrders || []).map(raw =>
                new BusinessOrderFactory().getModelFromData(
                    new BusinessOrderMapper().mapData(raw)
                )
            ),
            status: data.status,
        };
    }
}
