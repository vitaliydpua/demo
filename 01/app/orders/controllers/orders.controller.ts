import { JwtAuthGuard, OptionalJwtAuthGuard } from '@inft-app/auth/guards/jwt-auth.guard';
import { CalculateOrderDto } from '@inft-app/orders/controllers/dtos/calculate-order.dto';
import { CreateOrderDto } from '@inft-app/orders/controllers/dtos/create-order/create-order.dto';
import { CalculatedOrderModel } from '@inft-app/orders/models/calculate/calculated-order/calculated-order.model';
import { OrdersService } from '@inft-app/orders/services/orders.service';
import { SimpleUserModel } from '@inft-app/users/models/simple-user/simple-user.model';
import { AppRequest } from '@inft-common/shared/types/app-request.type';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ORDERS')
@Controller('api/v1/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Post('checkout')
    async checkout(@Body() body: CalculateOrderDto, @Req() req: AppRequest): Promise<CalculatedOrderModel> {
        // console.log(body);
        const res = await this.ordersService.calculate(body, req.user ? req.user as SimpleUserModel : null);
        // console.log(res);
        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrders(
        @Body() body: CreateOrderDto,
        @Req() req: AppRequest,
    ) {
        console.log('CREATE ORDER ->>>>>> ', body);
        return await this.ordersService.create(body, req.user as SimpleUserModel);
    }
}
