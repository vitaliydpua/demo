import { UUID } from '@inft-common/shared/types/uuid.type';

export interface PurchaseModelData {
    id: UUID;
    discount: number;
    price: number;
}

export interface PurchaseModel extends PurchaseModelData {}

export class PurchaseModel {}
