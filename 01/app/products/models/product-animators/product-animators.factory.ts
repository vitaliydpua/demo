import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductAnimatorsModel,
  ProductAnimatorsModelData
} from "@inft-app/products/models/product-animators/product-animators.model";

export class ProductAnimatorsFactory extends ModelFactory<ProductAnimatorsModelData, ProductAnimatorsModel> {
  protected getInstance(): ProductAnimatorsModel {
    return new ProductAnimatorsModel();
  }
}
