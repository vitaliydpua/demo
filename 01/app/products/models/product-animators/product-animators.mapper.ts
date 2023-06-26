import { ProductMapper } from '@inft-app/products/models/product/product.mapper';
import { ProductAnimatorsModelData } from '@inft-app/products/models/product-animators/product-animators.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';

import { ProductAnimatorsEntity } from '../../../../core/products/entities/product-animators.entity';


export class ProductAnimatorsMapper implements ModelDataMapper<ProductAnimatorsEntity, ProductAnimatorsModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductAnimatorsEntity): ProductAnimatorsModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
    };
  }
}
