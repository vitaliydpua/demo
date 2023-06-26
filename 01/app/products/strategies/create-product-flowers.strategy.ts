import { CreateProductStrategy } from "@inft-app/products/strategies/create-product.strategy";
import { ProductsCoreService } from "../../../core/products/services/products-core.service";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import { CreateProductFlowersDTO } from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { CreateProductFlowersParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-flowers-params.builder";
import { ProductEntity } from "../../../core/products/entities/product.entity";

export class CreateProductFlowersStrategy extends CreateProductStrategy {
  constructor(
    protected businessId: UUID,
    protected productsService: ProductsCoreService,
    protected awsService: AwsServiceApi
  ) {
    super(businessId, productsService, awsService);
  }

  async create(params: CreateProductFlowersDTO): Promise<ProductEntity> {
    return await this.productsService.createProductFlowers(
      new CreateProductFlowersParamsBuilder(params).build(this.businessId)
    );
  }
}
