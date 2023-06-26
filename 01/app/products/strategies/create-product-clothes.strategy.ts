import {
  CreateProductClothesDto
} from '@inft-app/products/controllers/dtos/products/create/create-product-clothes.dto';
import { CreateProductClothesParamsBuilder } from '@inft-app/products/params-builders/create-product/create-product-clothes-params.builder';
import { CreateProductStrategy } from '@inft-app/products/strategies/create-product.strategy';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';
import { UUID } from '@inft-common/shared/types/uuid.type';

import { ProductEntity } from '../../../core/products/entities/product.entity';
import { ProductsCoreService } from '../../../core/products/services/products-core.service';

export class CreateProductClothesStrategy extends CreateProductStrategy {
  constructor(
    protected businessId: UUID,
    protected productsService: ProductsCoreService,
    protected awsService: AwsServiceApi
  ) {
    super(businessId, productsService, awsService);
  }

  async create(params: CreateProductClothesDto): Promise<ProductEntity> {
    return await this.productsService.createProductClothes(
      new CreateProductClothesParamsBuilder(params).build(this.businessId)
    );
  }
}
