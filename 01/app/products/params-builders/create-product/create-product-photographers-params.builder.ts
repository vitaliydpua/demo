import { UUID } from "@inft-common/shared/types/uuid.type";
import { CreateProductParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-params.builder";
import {
  CreateProductPhotographersDTO,
} from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { CreateProductPhotographersParams } from "../../../../core/products/params/create-product-photographers.params";

export class CreateProductPhotographersParamsBuilder extends CreateProductParamsBuilder {
  constructor(protected params: CreateProductPhotographersDTO) {
    super(params);
  }

  build(businessId: UUID): CreateProductPhotographersParams {
    return {
      ...(super.build(businessId))
    };
  }
}
