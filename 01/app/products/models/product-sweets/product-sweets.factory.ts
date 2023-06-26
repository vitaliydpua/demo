import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductSweetsModel,
  ProductSweetsModelData
} from "@inft-app/products/models/product-sweets/product-sweets.model";

export class ProductSweetsFactory extends ModelFactory<ProductSweetsModelData, ProductSweetsModel> {
  protected getInstance(): ProductSweetsModel {
    return new ProductSweetsModel();
  }
}
