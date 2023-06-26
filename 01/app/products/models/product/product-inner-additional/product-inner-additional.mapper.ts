import {
  ProductInnerAdditionalModelData
} from '@inft-app/products/models/product/product-inner-additional/product-inner-additional.model';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';

import {
  ProductAdditionalEntity
} from '../../../../../core/products/entities/product-additional/product-additional.entity';


export class ProductInnerAdditionalMapper implements ModelDataMapper<
    ProductAdditionalEntity,
    ProductInnerAdditionalModelData
> {
  constructor(private awsService: AwsServiceApi) {
  }

  mapData(data: ProductAdditionalEntity): ProductInnerAdditionalModelData {
    const discount = data.discount ?? 0;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image ? this.awsService.generateFileLink(data.image) : null,
      price: data.price,
      categoryId: data.categoryId,
      productId: data.productId,
      discount: data.discount ?? 0,
      discountPrice: data.price - data.price * (discount / 100),
      required: data.required,
      min: data.minimum,
      max: data.maximum,
      type: data.type,
    };
  }
}
