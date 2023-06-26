import { LocationModel } from '@inft-app/locations/models/location.model';
import { BusinessOrderModel } from '@inft-app/orders/models/order/business-order/business-order.model';
import { UUID } from '@inft-common/shared/types/uuid.type';

import { EOrderStatus } from '../../../../core/orders/entities/order.entity';

export interface OrderModelData {
    id: UUID;
    deliveryAddress: LocationModel;
    deliveryDate: Date;
    status: EOrderStatus;
    name: string;
    userId: UUID;
    orders: BusinessOrderModel[];
}

export interface OrderModel extends OrderModelData {}

export class OrderModel {}
