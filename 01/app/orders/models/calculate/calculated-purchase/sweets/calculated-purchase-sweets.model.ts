import {
    CalculatedPurchaseModel,
    CalculatedPurchaseModelData,
} from '@inft-app/orders/models/calculate/calculated-purchase/calculated-purchase.model';

export interface CalculatedPurchaseSweetsModelData extends CalculatedPurchaseModelData {}

export interface CalculatedPurchaseSweetsModel extends CalculatedPurchaseSweetsModelData {}

export class CalculatedPurchaseSweetsModel extends CalculatedPurchaseModel {}
