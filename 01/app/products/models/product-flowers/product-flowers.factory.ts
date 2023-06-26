import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductFlowersModel,
  ProductFlowersModelData
} from "@inft-app/products/models/product-flowers/product-flowers.model";

export class ProductFlowersFactory extends ModelFactory<ProductFlowersModelData, ProductFlowersModel> {
  protected getInstance(): ProductFlowersModel {
    return new ProductFlowersModel();
  }
}
