import { UUID } from '@inft-common/shared/types/uuid.type';

import {
  EProductAdditionalType
} from '../../../../../core/products/entities/product-additional/product-additional.entity';

export interface ProductInnerAdditionalModelData {
  id: UUID;
  name: string;
  description: string;
  image: string | null;
  price: number;
  discount: number;
  discountPrice: number;
  required: boolean;
  min: number;
  max: number;
  type: EProductAdditionalType;
  categoryId: UUID;
  productId: UUID;
}

export interface ProductInnerAdditionalModel extends ProductInnerAdditionalModelData {}

export class ProductInnerAdditionalModel {}
