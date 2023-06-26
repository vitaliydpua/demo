import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductMakeUpModel,
  ProductMakeUpModelData
} from "@inft-app/products/models/product-make-up/product-make-up.model";

export class ProductMakeUpFactory extends ModelFactory<ProductMakeUpModelData, ProductMakeUpModel> {
  protected getInstance(): ProductMakeUpModel {
    return new ProductMakeUpModel();
  }
}
