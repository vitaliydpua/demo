import { CreateProductDTO } from '@inft-app/products/controllers/dtos/products/create/create-product.dto';
import { UUID } from '@inft-common/shared/types/uuid.type';

import { CreateProductParams } from '../../../../core/products/params/create-product.params';

export abstract class CreateProductParamsBuilder {
  protected constructor(protected params: CreateProductDTO) {}

  build(businessId: UUID): CreateProductParams {
    return {
      name: this.params.name,
      description: this.params.description,
      discount: this.params.discount,
      price: this.params.price,
      categoryId: this.params.categoryId,
      businessId,
      minimum: 1,
      maximum: 1,
    };
  }
}
