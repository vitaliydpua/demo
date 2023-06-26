import { CreateProductStrategy } from "@inft-app/products/strategies/create-product.strategy";
import { ProductsCoreService } from "../../../core/products/services/products-core.service";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import {
  CreateProductMakeUpDTO,
} from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { ProductEntity } from "../../../core/products/entities/product.entity";
import { CreateProductMakeUpParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-make-up-params.builder";

export class CreateProductMakeUpStrategy extends CreateProductStrategy {
  constructor(
    protected businessId: UUID,
    protected productsService: ProductsCoreService,
    protected awsService: AwsServiceApi
  ) {
    super(businessId, productsService, awsService);
  }

  async create(params: CreateProductMakeUpDTO): Promise<ProductEntity> {
    return await this.productsService.createProductMakeUp(
      new CreateProductMakeUpParamsBuilder(params).build(this.businessId)
    );
  }
}
