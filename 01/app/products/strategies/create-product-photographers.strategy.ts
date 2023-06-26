import { CreateProductStrategy } from "@inft-app/products/strategies/create-product.strategy";
import { ProductsCoreService } from "../../../core/products/services/products-core.service";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import {
  CreateProductPhotographersDTO,
} from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { ProductEntity } from "../../../core/products/entities/product.entity";
import { CreateProductPhotographersParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-photographers-params.builder";

export class CreateProductPhotographersStrategy extends CreateProductStrategy {
  constructor(
    protected businessId: UUID,
    protected productsService: ProductsCoreService,
    protected awsService: AwsServiceApi
  ) {
    super(businessId, productsService, awsService);
  }

  async create(params: CreateProductPhotographersDTO): Promise<ProductEntity> {
    return await this.productsService.createProductPhotographers(
      new CreateProductPhotographersParamsBuilder(params).build(this.businessId)
    );
  }
}
