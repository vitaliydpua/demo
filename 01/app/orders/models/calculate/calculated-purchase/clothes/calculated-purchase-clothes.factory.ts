import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

import {
    CalculatedPurchaseClothesModel,
    CalculatedPurchaseClothesModelData,
} from './calculated-purchase-clothes.model';

export class CalculatedPurchaseClothesFactory extends ModelFactory<CalculatedPurchaseClothesModelData, CalculatedPurchaseClothesModel> {
    protected getInstance(): CalculatedPurchaseClothesModel {
        return new CalculatedPurchaseClothesModel();
    }
}
