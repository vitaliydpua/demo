import { Required } from '@inft-common/decorators';
import { Id } from '@inft-common/decorators/common/id.decorator';
import { UUID } from '@inft-common/shared/types/uuid.type';

export class AddProductInnerAdditionalImageDto {
  @Id(Required.STRONG)
  productId: UUID;
}
