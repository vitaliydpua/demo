import { UUID } from "@inft-common/shared/types/uuid.type";
import { CreateProductParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-params.builder";
import { CreateProductFlowersDTO } from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { CreateProductFlowersParams } from "../../../../core/products/params/create-product-flowers.params";

export class CreateProductFlowersParamsBuilder extends CreateProductParamsBuilder {
  constructor(protected params: CreateProductFlowersDTO) {
    super(params);
  }

  build(businessId: UUID): CreateProductFlowersParams {
    return {
      ...(super.build(businessId))
    };
  }
}
