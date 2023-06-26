import { BusinessOrderModelData } from '@inft-app/orders/models/order/business-order/business-order.model';
import { PurchaseFactory } from '@inft-app/orders/models/order/business-order/purchase/purchase.factory';
import { PurchaseMapper } from '@inft-app/orders/models/order/business-order/purchase/purchase.mapper';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';

import { BusinessOrderEntity } from '../../../../../core/orders/entities/business-order.entity';

export class BusinessOrderMapper extends ModelDataMapper<BusinessOrderEntity, BusinessOrderModelData> {
    mapData(data: BusinessOrderEntity): BusinessOrderModelData {
        return {
            id: data.id,
            note: data.note,
            status: data.status,
            orderId: data.orderId,
            purchases: (data.purchases || []).map(raw =>
                new PurchaseFactory().getModelFromData(
                    new PurchaseMapper().mapData(raw)
                )
            )
        };
    }
}
