import { ModelFactory } from "@inft-common/abstract/model-factory.abstract";
import {
  ProductPhotographersModel,
  ProductPhotographersModelData
} from "@inft-app/products/models/product-photographers/product-photographers.model";

export class ProductPhotographersFactory extends ModelFactory<ProductPhotographersModelData, ProductPhotographersModel> {
  protected getInstance(): ProductPhotographersModel {
    return new ProductPhotographersModel();
  }
}
