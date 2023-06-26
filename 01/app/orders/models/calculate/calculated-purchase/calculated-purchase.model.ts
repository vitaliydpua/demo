import { EBusinessActivity } from '@inft-common/shared/enums/business-activity.enum';
import { UUID } from '@inft-common/shared/types/uuid.type';

export interface CalculatedPurchaseModelData {
    id: UUID;
    name: string;
    price: number;
    discountPrice: number;
    discount: number;
    category: string;
    images: string[];
    businessActivity: EBusinessActivity;
}

export interface CalculatedPurchaseModel extends CalculatedPurchaseModelData {}

export class CalculatedPurchaseModel {}
