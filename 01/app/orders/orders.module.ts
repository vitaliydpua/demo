import { OrdersController } from '@inft-app/orders/controllers/orders.controller';
import { OrdersService } from '@inft-app/orders/services/orders.service';
import { ProductsModule } from '@inft-app/products/products.module';
import { UsersModule } from '@inft-app/users/users.module';
import { ServicesApiModule } from '@inft-common/api/services-api.module';
import { Module } from '@nestjs/common';

import { OrdersCoreModule } from '../../core/orders/orders-core.module';

@Module({
    imports: [OrdersCoreModule, ProductsModule, UsersModule, ServicesApiModule],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [OrdersService],
})
export class OrdersModule {}
