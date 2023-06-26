import { CalculateOrderDto } from '@inft-app/orders/controllers/dtos/calculate-order.dto';
import { OrderNoteDto } from '@inft-app/orders/controllers/dtos/create-order/order-note.dto';
import { PaymentDto } from '@inft-app/orders/controllers/dtos/payment-method.dto';
import { Required } from '@inft-common/decorators';
import { OrderComment } from '@inft-common/decorators/orders/order-comment.decorator';
import { OrderCommentsList } from '@inft-common/decorators/orders/order-comments-list.decorator';
import { Payment } from '@inft-common/decorators/payments/payment.decorator';
import { IsDateString } from 'class-validator';

export class CreateOrderDto extends CalculateOrderDto {
    @IsDateString()
    deliveryDate: string;

    @OrderComment(Required.NULLABLE)
    comment: string | null;

    @Payment(Required.STRONG)
    payment: PaymentDto;

    @OrderCommentsList(Required.NULLABLE)
    notes: OrderNoteDto[] | null;
}
