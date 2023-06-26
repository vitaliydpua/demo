import { Required } from '@inft-common/decorators';
import { Id } from '@inft-common/decorators/common/id.decorator';
import { OrderComment } from '@inft-common/decorators/orders/order-comment.decorator';
import { UUID } from '@inft-common/shared/types/uuid.type';

export class OrderNoteDto {
    @Id(Required.STRONG)
    businessId: UUID;

    @OrderComment(Required.STRONG)
    comment: string;
}
