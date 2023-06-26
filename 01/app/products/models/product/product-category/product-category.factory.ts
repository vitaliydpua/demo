import {
  ProductCategoryModel,
  ProductCategoryModelData,
} from '@inft-app/products/models/product/product-category/product-category.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';


export class ProductCategoryFactory extends ModelFactory<ProductCategoryModelData, ProductCategoryModel> {
  protected getInstance(): ProductCategoryModel {
    return new ProductCategoryModel();
  }
}
