import { Required } from '@inft-common/decorators';
import { Id } from '@inft-common/decorators/common/id.decorator';
import { ProductDescription } from '@inft-common/decorators/products/product/product-description.decorator';
import { ProductDiscount } from '@inft-common/decorators/products/product/product-discount.decorator';
import { ProductName } from '@inft-common/decorators/products/product/product-name.decorator';
import { ProductPrice } from '@inft-common/decorators/products/product/product-price.decorator';
import { UUID } from '@inft-common/shared/types/uuid.type';

export class CreateProductDTO {
  @ProductName(Required.STRONG)
  name: string;

  @ProductDescription(Required.STRONG)
  description: string;

  @ProductDiscount(Required.NULLABLE)
  discount: number | null;

  @ProductPrice(Required.STRONG)
  price: number;

  @Id(Required.STRONG)
  categoryId: UUID;
}

export class CreateProductSweetsDTO extends CreateProductDTO {}

export class CreateProductAnimatorsDTO extends CreateProductDTO {}

export class CreateProductDecorationsDTO extends CreateProductDTO {}

export class CreateProductFlowersDTO extends CreateProductDTO {}

export class CreateProductPhotographersDTO extends CreateProductDTO {}

export class CreateProductMakeUpDTO extends CreateProductDTO {}
