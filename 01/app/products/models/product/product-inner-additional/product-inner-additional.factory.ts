import {
  ProductInnerAdditionalModel, ProductInnerAdditionalModelData,
} from '@inft-app/products/models/product/product-inner-additional/product-inner-additional.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';

export class ProductInnerAdditionalFactory extends ModelFactory<
    ProductInnerAdditionalModelData,
    ProductInnerAdditionalModel
> {
  protected getInstance(): ProductInnerAdditionalModel {
    return new ProductInnerAdditionalModel();
  }
}
