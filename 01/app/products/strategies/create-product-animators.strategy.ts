import {
  CreateProductAnimatorsDTO,
} from '@inft-app/products/controllers/dtos/products/create/create-product.dto';
import { CreateProductAnimatorsParamsBuilder } from '@inft-app/products/params-builders/create-product/create-product-animators-params.builder';
import { CreateProductStrategy } from '@inft-app/products/strategies/create-product.strategy';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';
import { UUID } from '@inft-common/shared/types/uuid.type';

import { ProductEntity } from '../../../core/products/entities/product.entity';
import { ProductsCoreService } from '../../../core/products/services/products-core.service';

export class CreateProductAnimatorsStrategy extends CreateProductStrategy {
  constructor(
    protected businessId: UUID,
    protected productsService: ProductsCoreService,
    protected awsService: AwsServiceApi
  ) {
    super(businessId, productsService, awsService);
  }

  async create(params: CreateProductAnimatorsDTO): Promise<ProductEntity> {
    return await this.productsService.createProductAnimators(
      new CreateProductAnimatorsParamsBuilder(params).build(this.businessId)
    );
  }
}
