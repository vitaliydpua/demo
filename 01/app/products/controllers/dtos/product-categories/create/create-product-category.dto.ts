import { Required } from '@inft-common/decorators';
import { ProductCategoryName } from '@inft-common/decorators/products/product-category/category-name.decorator';
import { CategoryPosition } from '@inft-common/decorators/products/product-category/category-position.decorator';

export class CreateProductCategoryDTO {
  @ProductCategoryName(Required.STRONG)
  name: string;

  @CategoryPosition(Required.OPTIONAL)
  position?: number;
}
