import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import { ProductModel, ProductModelData } from "@inft-app/products/models/product/product.model";

export class ProductFactory extends ModelFactory<ProductModelData, ProductModel> {
  protected getInstance(): ProductModel {
    return new ProductModel();
  }
}
