import { ImageFactory } from '@inft-app/images/models/image.factory';
import { ImageMapper } from '@inft-app/images/models/image.mapper';
import { ProductCategoryFactory } from '@inft-app/products/models/product/product-category/product-category.factory';
import { ProductCategoryMapper } from '@inft-app/products/models/product/product-category/product-category.mapper';
import {
  ProductInnerAdditionalFactory
} from '@inft-app/products/models/product/product-inner-additional/product-inner-additional.factory';
import {
  ProductInnerAdditionalMapper
} from '@inft-app/products/models/product/product-inner-additional/product-inner-additional.mapper';
import {
  ProductInnerAdditionalModel
} from '@inft-app/products/models/product/product-inner-additional/product-inner-additional.model';
import { ProductModelData } from '@inft-app/products/models/product/product.model';
import { BusinessUserShortFactory } from '@inft-app/users/models/business-user-short/business-user-short.factory';
import { BusinessUserShortMapper } from '@inft-app/users/models/business-user-short/business-user-short.mapper';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';
import * as _ from 'lodash';

import {
  ProductAdditionalEntity
} from '../../../../core/products/entities/product-additional/product-additional.entity';
import { ProductEntity } from '../../../../core/products/entities/product.entity';



export class ProductMapper implements ModelDataMapper<ProductEntity, ProductModelData> {
  constructor(private awsService: AwsServiceApi) {
  }

  mapData(data: ProductEntity): ProductModelData {
    const discount = data.discount ?? 0;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      discount,
      discountPrice: data.price - data.price * (discount / 100),
      price: Number(data.price),
      min: data.minimum,
      max: data.maximum,
      images: (data.images || []).map((raw) =>
        new ImageFactory().getModelFromData(
          new ImageMapper(this.awsService).mapData(raw)
        )
      ),
      business: new BusinessUserShortFactory().getModelFromData(
          new BusinessUserShortMapper(this.awsService).mapData(data.business)
      ),
      category: new ProductCategoryFactory().getModelFromData(
        new ProductCategoryMapper().mapData(data.category)
      ),
      innerAdditional: this.mapInnerAdditional(data.innerAdditional || []),
    };
  }

  private mapInnerAdditional(data: ProductAdditionalEntity[]): { [key: string]: ProductInnerAdditionalModel[] } {
    const sortedUniqCategories = _.uniqBy(data.map(pa => pa.category), c => c.name)
        .sort((a, b) => a.position - b.position);

    return Object.values(sortedUniqCategories).reduce<{ [key: string]: ProductInnerAdditionalModel[] }>((acc, cat) => {
      if (!acc[cat.name]) {
        acc[cat.name] = [];
      }
      acc[cat.name] = data.filter(d => d.category.name === cat.name).map(raw =>
          new ProductInnerAdditionalFactory().getModelFromData(
              new ProductInnerAdditionalMapper(this.awsService).mapData(raw)
          )
      );

      return acc;
    }, {});
  }
}
