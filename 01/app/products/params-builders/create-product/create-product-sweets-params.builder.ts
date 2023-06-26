import { UUID } from "@inft-common/shared/types/uuid.type";
import { CreateProductParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-params.builder";
import { CreateProductSweetsDTO } from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { CreateProductSweetsParams } from "../../../../core/products/params/create-product-sweets.params";

export class CreateProductSweetsParamsBuilder extends CreateProductParamsBuilder {
  constructor(protected params: CreateProductSweetsDTO) {
    super(params);
  }

  build(businessId: UUID): CreateProductSweetsParams {
    return {
      ...(super.build(businessId))
    };
  }
}
