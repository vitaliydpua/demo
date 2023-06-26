import {
    CreateProductClothesDto,
} from '@inft-app/products/controllers/dtos/products/create/create-product-clothes.dto';
import {
    CreateProductParamsBuilder,
} from '@inft-app/products/params-builders/create-product/create-product-params.builder';
import { UUID } from '@inft-common/shared/types/uuid.type';

import { CreateProductClothesParams } from '../../../../core/products/params/create-product-clothes.params';

export class CreateProductClothesParamsBuilder extends CreateProductParamsBuilder {
    constructor(protected params: CreateProductClothesDto) {
        super(params);
    }

    build(businessId: UUID): CreateProductClothesParams {
        return {
            ...super.build(businessId),
            sizes: this.params.sizes.map(s => ({ size: s.size, description: s.description ?? null })),
            rentRequirements: this.params.rentRequirements,
        };
    }
}
