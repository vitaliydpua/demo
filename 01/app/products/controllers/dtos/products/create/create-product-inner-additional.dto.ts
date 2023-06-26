import { Required } from '@inft-common/decorators';
import { Id } from '@inft-common/decorators/common/id.decorator';
import { ProductDescription } from '@inft-common/decorators/products/product/product-description.decorator';
import { ProductDiscount } from '@inft-common/decorators/products/product/product-discount.decorator';
import { ProductName } from '@inft-common/decorators/products/product/product-name.decorator';
import { ProductPrice } from '@inft-common/decorators/products/product/product-price.decorator';
import { UUID } from '@inft-common/shared/types/uuid.type';

export class CreateProductInnerAdditionalDto {
  @ProductName(Required.STRONG)
  name: string;

  @ProductPrice(Required.STRONG)
  price: number;

  @ProductDescription(Required.STRONG)
  description;

  @Id(Required.STRONG)
  categoryId: UUID;

  @Id(Required.STRONG)
  productId: UUID;

  @ProductDiscount(Required.NULLABLE)
  discount: number | null;
}
