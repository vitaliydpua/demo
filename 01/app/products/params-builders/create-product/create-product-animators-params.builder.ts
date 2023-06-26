import {
  CreateProductAnimatorsDTO,
} from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { CreateProductAnimatorsParams } from "../../../../core/products/params/create-product-animators.params";
import { CreateProductParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-params.builder";

export class CreateProductAnimatorsParamsBuilder extends CreateProductParamsBuilder {
  constructor(protected params: CreateProductAnimatorsDTO) {
    super(params);
  }

  build(businessId: UUID): CreateProductAnimatorsParams {
    return {
      ...(super.build(businessId))
    };
  }
}
