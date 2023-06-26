import { Id } from "@inft-common/decorators/common/id.decorator";
import { Required } from "@inft-common/decorators";
import { UUID } from "@inft-common/shared/types/uuid.type";

export class DeleteCategoryDTO {
  @Id(Required.STRONG)
  categoryId: UUID;
}
