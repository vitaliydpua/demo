import { ProductMapper } from '@inft-app/products/models/product/product.mapper';
import { ProductSweetsModelData } from '@inft-app/products/models/product-sweets/product-sweets.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';

import { ProductSweetsEntity } from '../../../../core/products/entities/product-sweets.entity';


export class ProductSweetsMapper implements ModelDataMapper<ProductSweetsEntity, ProductSweetsModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductSweetsEntity): ProductSweetsModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
      sizes: data.sizes,
      flavors: data.flavors,
    };
  }
}
