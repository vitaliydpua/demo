import { PurchaseModel } from '@inft-app/orders/models/order/business-order/purchase/purchase.model';
import { UUID } from '@inft-common/shared/types/uuid.type';

import { EBusinessOrderStatus } from '../../../../../core/orders/entities/business-order.entity';

export interface BusinessOrderModelData {
    id: UUID;
    note: string | null;
    status: EBusinessOrderStatus;
    orderId: UUID;
    purchases: PurchaseModel[];
}

export interface BusinessOrderModel extends BusinessOrderModelData {}

export class BusinessOrderModel {}
