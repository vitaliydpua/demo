import { ProductMapper } from '@inft-app/products/models/product/product.mapper';
import { ProductClothesModelData } from '@inft-app/products/models/product-clothes/product-clothes.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';

import { ProductClothesEntity } from '../../../../core/products/entities/product-clothes.entity';

export class ProductClothesMapper implements ModelDataMapper<ProductClothesEntity, ProductClothesModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductClothesEntity): ProductClothesModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
      sizes: data.sizes,
    };
  }
}
