import { ImageModel } from '@inft-app/images/models/image.model';
import { ProductCategoryModel } from '@inft-app/products/models/product/product-category/product-category.model';
import {
  ProductInnerAdditionalModel
} from '@inft-app/products/models/product/product-inner-additional/product-inner-additional.model';
import { BusinessUserShortModel } from '@inft-app/users/models/business-user-short/business-user-short.model';
import { UUID } from '@inft-common/shared/types/uuid.type';

export interface ProductModelData {
  id: UUID;
  name: string;
  description: string;
  discount: number;
  price: number;
  discountPrice: number;
  images: ImageModel[];
  business: BusinessUserShortModel;
  category: ProductCategoryModel;
  max: number;
  min: number;
  innerAdditional: { [key: string]: ProductInnerAdditionalModel[] };
}

export interface ProductModel extends ProductModelData {}

export class ProductModel {}
