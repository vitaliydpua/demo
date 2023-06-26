import { ProductModel, ProductModelData } from '@inft-app/products/models/product/product.model';
import { SizeInfo } from '@inft-common/shared/interfaces/size-info.interface';

export interface ProductClothesModelData extends ProductModelData {
  sizes: SizeInfo[];
}

export interface ProductClothesModel extends ProductClothesModelData {}

export class ProductClothesModel extends ProductModel {}
