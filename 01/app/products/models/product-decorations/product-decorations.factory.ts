import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductDecorationsModel,
  ProductDecorationsModelData
} from "@inft-app/products/models/product-decorations/product-decorations.model";

export class ProductDecorationsFactory extends ModelFactory<ProductDecorationsModelData, ProductDecorationsModel> {
  protected getInstance(): ProductDecorationsModel {
    return new ProductDecorationsModel();
  }
}
