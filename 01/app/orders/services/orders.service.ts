import { LocationFactory } from '@inft-app/locations/models/location.factory';
import { LocationMapper } from '@inft-app/locations/models/location.mapper';
import { LocationModel } from '@inft-app/locations/models/location.model';
import { CalculateOrderDto } from '@inft-app/orders/controllers/dtos/calculate-order.dto';
import { CreateOrderDto } from '@inft-app/orders/controllers/dtos/create-order/create-order.dto';
import { CalculateDeliveryHandler } from '@inft-app/orders/handlers/calculate-delivery.handler';
import { CalculatePurchasesHandler } from '@inft-app/orders/handlers/calculate-purchases.handler';
import { CalculatedOrderFactory } from '@inft-app/orders/models/calculate/calculated-order/calculated-order.factory';
import { CalculatedOrderModel } from '@inft-app/orders/models/calculate/calculated-order/calculated-order.model';
import {
    CalculatedPurchaseClothesModel,
} from '@inft-app/orders/models/calculate/calculated-purchase/clothes/calculated-purchase-clothes.model';
import {
    CalculatedPurchaseSweetsModel,
} from '@inft-app/orders/models/calculate/calculated-purchase/sweets/calculated-purchase-sweets.model';
import { OrderFactory } from '@inft-app/orders/models/order/order.factory';
import { OrderMapper } from '@inft-app/orders/models/order/order.mapper';
import { OrderModel } from '@inft-app/orders/models/order/order.model';
import { PaymentFactory } from '@inft-app/payments/models/payment.factory';
import { ProductsService } from '@inft-app/products/services/products.service';
import { SimpleUserModel } from '@inft-app/users/models/simple-user/simple-user.model';
import { UsersService } from '@inft-app/users/services/users.service';
import { GoogleServiceApi } from '@inft-common/api/google/google-service.api';
import { AppError } from '@inft-common/error/app.error';
import { UUID } from '@inft-common/shared/types/uuid.type';
import { Injectable } from '@nestjs/common';

import { OrdersCoreService } from '../../../core/orders/services/orders-core.service';
import {
    PreparePurchaseClothesParamsBuilder,
} from '../../../core/purchases/params/builders/prepare-purchase-clothes-params.builder';
import {
    PreparePurchaseSweetsParamsBuilder,
} from '../../../core/purchases/params/builders/prepare-purchase-sweets-params.builder';
import { CreatePurchaseParams } from '../../../core/purchases/params/create-purchase.params';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersService: OrdersCoreService,
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        private readonly googleService: GoogleServiceApi,
    ) {
    }

    async userLastDeliveryAddress(userId: UUID): Promise<LocationModel | null> {
        const rawAddress = await this.ordersService.getLastDeliveryAddress(userId);

        return rawAddress ? new LocationFactory().getModelFromData(
            new LocationMapper().mapData(rawAddress),
        ) : null;
    }

    // TODO: User can cancel the order if the order status is pending

    async create(params: CreateOrderDto, user: SimpleUserModel): Promise<OrderModel> {
        const calculatedOrder = await this.calculate(params, user);

        const orderEntity = await this.ordersService.saveOrder({
            deliveryDate: new Date(calculatedOrder.activeDelivery.activeDate),
            deliveryAddress: {
                country: calculatedOrder.activeDelivery.location.country,
                formattedAddress: null,
                postCode: calculatedOrder.activeDelivery.location.postCode,
                city: calculatedOrder.activeDelivery.location.city,
                street: calculatedOrder.activeDelivery.location.street,
                building: calculatedOrder.activeDelivery.location.building,
                latitude: calculatedOrder.activeDelivery.location.coords.latitude,
                longitude: calculatedOrder.activeDelivery.location.coords.longitude,
            },
            userId: user.id,
            notes: (params.notes || []).map(n => ({ businessId: n.businessId, note: n.comment })),
            purchases: this.prepareCreateParams(calculatedOrder),
        });
        orderEntity.businessOrders.forEach(bo => {
            console.log(bo.purchases);
        });
        const order = new OrderFactory().getModelFromData(
            new OrderMapper().mapData(orderEntity)
        );

        // TODO: Set commission for each business order
        // TODO: Create invoice for each business order
        // order.orders.
        // TODO: Send notifications(sms/push) about a new order for businesses

        order.orders.forEach(o => {
            console.log(o.purchases);
        });
        return order;
    }

    // async getUserActiveOrders(userId: UUID): Promise<void> {}

    async calculate(params: CalculateOrderDto, user: SimpleUserModel | null): Promise<CalculatedOrderModel> {
        // TODO: Check distance between user and delivery location (Sokolska 5{ latitude: 50.26074333994922, longitude: 19.01443720044987 })
        // TODO: Payment
        const errors: AppError[] = [];
        const products = await this.productsService.getProductsByIds(params.purchases.map(p => p.id));
        const calculatedPurchases = new CalculatePurchasesHandler(products, params.purchases).handle();

        return new CalculatedOrderFactory().getModelFromData({
            activeDelivery: await new CalculateDeliveryHandler(
                this,
                this.usersService,
                products,
                this.googleService,
                params.deliveryLocation,
                params.deliveryDate,
                user,
            ).handle(),
            purchases: calculatedPurchases,
            activePayment: params.payment ? new PaymentFactory().getModelFromData({ method: params.payment.method }) : null,
            locations: user?.locations || [],
            businesses: await this.usersService.getShortBusinessesByIds(Object.keys(calculatedPurchases)),
            // TODO: Discounts ???
            // discounts: [],
        });
    }

    private prepareCreateParams(
        calculatedOrder: CalculatedOrderModel,
    ): { [businessId: UUID]: CreatePurchaseParams[] } {
        return Object.entries(calculatedOrder.purchases)
            .reduce<{ [businessId: UUID]: CreatePurchaseParams[] }>((acc, [businessId, purchases]) => {
                if (!acc[businessId]) {
                    acc[businessId] = [];
                }


                if (purchases.every(p => p instanceof CalculatedPurchaseClothesModel)) {
                    acc[businessId].push(
                        ...purchases.filter(
                            (p): p is CalculatedPurchaseClothesModel => p instanceof CalculatedPurchaseClothesModel,
                        ).map(p => new PreparePurchaseClothesParamsBuilder(p).build()),
                    );
                }

                if (purchases.every(p => p instanceof CalculatedPurchaseSweetsModel)) {
                    acc[businessId].push(
                        ...purchases.filter(
                            (p): p is CalculatedPurchaseSweetsModel => p instanceof CalculatedPurchaseSweetsModel,
                        ).map(p => new PreparePurchaseSweetsParamsBuilder(p).build()),
                    );
                }

                return acc;
            }, {});
    }
}
