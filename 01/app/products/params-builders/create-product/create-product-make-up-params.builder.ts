import { UUID } from "@inft-common/shared/types/uuid.type";
import { CreateProductParamsBuilder } from "@inft-app/products/params-builders/create-product/create-product-params.builder";
import {
  CreateProductMakeUpDTO,
} from "@inft-app/products/controllers/dtos/products/create/create-product.dto";
import { CreateProductMakeUpParams } from "../../../../core/products/params/create-product-make-up.params";

export class CreateProductMakeUpParamsBuilder extends CreateProductParamsBuilder {
  constructor(protected params: CreateProductMakeUpDTO) {
    super(params);
  }

  build(businessId: UUID): CreateProductMakeUpParams {
    return {
      ...(super.build(businessId))
    };
  }
}
