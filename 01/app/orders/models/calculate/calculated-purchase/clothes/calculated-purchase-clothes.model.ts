import {
    CalculatedPurchaseModel,
    CalculatedPurchaseModelData,
} from '@inft-app/orders/models/calculate/calculated-purchase/calculated-purchase.model';

export interface CalculatedPurchaseClothesModelData extends CalculatedPurchaseModelData {
    size: string;
}

export interface CalculatedPurchaseClothesModel extends CalculatedPurchaseClothesModelData {}

export class CalculatedPurchaseClothesModel extends CalculatedPurchaseModel {}
