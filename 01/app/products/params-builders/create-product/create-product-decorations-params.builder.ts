import {
  CreateProductDecorationsDTO
} from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { CreateProductParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-params.builder";
import { CreateProductDecorationsParams } from "../../../../core/products/params/create-product-decorations.params";

export class CreateProductDecorationsParamsBuilder extends CreateProductParamsBuilder {
  constructor(protected params: CreateProductDecorationsDTO) {
    super(params);
  }

  build(businessId: UUID): CreateProductDecorationsParams {
    return {
      ...(super.build(businessId))
    };
  }
}
