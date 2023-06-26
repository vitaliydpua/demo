import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductClothesModel,
  ProductClothesModelData
} from "@inft-app/products/models/product-clothes/product-clothes.model";

export class ProductClothesFactory extends ModelFactory<ProductClothesModelData, ProductClothesModel> {
  protected getInstance(): ProductClothesModel {
    return new ProductClothesModel();
  }
}
