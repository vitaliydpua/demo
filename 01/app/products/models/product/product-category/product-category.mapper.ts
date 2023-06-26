import { ProductCategoryModelData } from '@inft-app/products/models/product/product-category/product-category.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';

import { ProductCategoryEntity } from '../../../../../core/products/entities/product-category/product-category.entity';


export class ProductCategoryMapper implements ModelDataMapper<ProductCategoryEntity, ProductCategoryModelData> {
  mapData(raw: ProductCategoryEntity): ProductCategoryModelData {
    return {
      id: raw.id,
      name: raw.name,
      position: raw.position,
    };
  }
}
