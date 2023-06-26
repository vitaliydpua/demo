import { ProductModel, ProductModelData } from '@inft-app/products/models/product/product.model';
import { SizeInfo } from '@inft-common/shared/interfaces/size-info.interface';

import { FlavorInfo } from '../../../../core/products/entities/product-sweets.entity';

export interface ProductSweetsModelData extends ProductModelData {
    flavors: FlavorInfo[];
    sizes: SizeInfo[];
}

export interface ProductSweetsModel extends ProductSweetsModelData {}

export class ProductSweetsModel extends ProductModel {}
