import { CreateProductDTO } from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { ProductsCoreService } from "../../../core/products/services/products-core.service";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import { ProductEntity } from "../../../core/products/entities/product.entity";

export abstract class CreateProductStrategy {
  protected constructor(
    protected businessId: UUID,
    protected productsService: ProductsCoreService,
    protected awsService: AwsServiceApi
  ) {}

  abstract create(params: CreateProductDTO): Promise<ProductEntity>
}
