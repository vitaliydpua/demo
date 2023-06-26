import { UUID } from '@inft-common/shared/types/uuid.type';

export interface ProductCategoryModelData {
  id: UUID;
  name: string;
  position: number;
}

export interface ProductCategoryModel extends ProductCategoryModelData {}

export class ProductCategoryModel {}
