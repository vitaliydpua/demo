import { PurchaseModelData } from '@inft-app/orders/models/order/business-order/purchase/purchase.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';

import { PurchaseEntity } from '../../../../../../core/purchases/entities/purchase.entity';

export class PurchaseMapper extends ModelDataMapper<PurchaseEntity, PurchaseModelData> {
    mapData(data: PurchaseEntity): PurchaseModelData {
        return {
            id: data.id,
            discount: data.discount ?? 0,
            price: data.price,
        };
    }
}
