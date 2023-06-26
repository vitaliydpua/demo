import { Id } from "@inft-common/decorators/common/id.decorator";
import { Required } from "@inft-common/decorators";
import { UUID } from "@inft-common/shared/types/uuid.type";
import { ProductCategoryName } from "@inft-common/decorators/products/product-category/category-name.decorator";

export class UpdateCategoryDTO {
  @Id(Required.STRONG)
  categoryId: UUID;

  @ProductCategoryName(Required.STRONG)
  name: string;
}
