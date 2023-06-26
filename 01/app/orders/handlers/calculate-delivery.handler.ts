import { LocationAddressDto } from '@inft-app/locations/controllers/dtos/location-address.dto';
import { calculateDeliveryPriceHelper } from '@inft-app/orders/helpers/calculate-delivery-price.helper';
import {
    CalculatedDeliveryLocationFactory
} from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery-location/calculated-delivery-location.factory';
import {
    CalculatedDeliveryLocationModel, CalculatedDeliveryLocationModelData
} from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery-location/calculated-delivery-location.model';
import {
    CalculatedDeliveryFactory
} from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery.factory';
import { CalculatedDeliveryModel } from '@inft-app/orders/models/calculate/calculated-delivery/calculated-delivery.model';
import { OrdersService } from '@inft-app/orders/services/orders.service';
import { ProductModel } from '@inft-app/products/models/product/product.model';
import { UserModel } from '@inft-app/users/models/user/user.model';
import { UsersService } from '@inft-app/users/services/users.service';
import { GoogleServiceApi } from '@inft-common/api/google/google-service.api';
import * as moment from 'moment';

export class CalculateDeliveryHandler {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly usersService: UsersService,
        private readonly products: ProductModel[],
        private readonly googleService: GoogleServiceApi,
        private readonly deliveryLocation: LocationAddressDto | undefined,
        private readonly deliveryDate: string | null,
        private user: UserModel | null,
    ) {
    }
    async handle(): Promise<CalculatedDeliveryModel> {
        const location = this.calculateDeliveryLocation();

        let deliveryDistances: number[] = [];

        if (location) {
            const businessesLocations = await this.usersService.getBusinessLocationsMap(
                [...new Set(this.products.map(p => p.business.id))]
            );
            // deliveryDistances = await this.googleService.calculateDistances(
            //     location.coords,
            //     Object.values(businessesLocations).map(b => b.coords),
            // ).toPromise();

            deliveryDistances = [1500];
        }
        // TODO: Get date from query
        let date = this.deliveryDate ? moment(this.deliveryDate).utc() : moment().utc().add(2, 'days');
        date = date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        return new CalculatedDeliveryFactory().getModelFromData({
            location,
            price: calculateDeliveryPriceHelper(deliveryDistances),
            activeDate: date.valueOf(),
            activeDateFormat: date.format('DD MMMM'),
            deliveries: this.calculateDeliveries(),
        });
    }

    private calculateDeliveryLocation(): CalculatedDeliveryLocationModel | null {
        // const lastDeliveryAddress = this.user && await this.ordersService.userLastDeliveryAddress(this.user.id);
        // const location: CalculatedDeliveryLocationModelData = lastDeliveryAddress ?? this.deliveryLocation ?? null;
        const location: CalculatedDeliveryLocationModelData = this.deliveryLocation ?? null;

        return location ? new CalculatedDeliveryLocationFactory().getModelFromData({
            country: location.country,
            city: location.city,
            postCode: location.postCode,
            street: location.street,
            building: location.building,
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },
        }) : null;
    }

    private calculateDeliveries(): string[] {
        const deliveries: string[] = [];
        const minDeliveryDays = 2;
        const week = 7;

        for(let i = minDeliveryDays; i < week + minDeliveryDays; i++) {
            deliveries.push(moment().utc().add(i, 'day').format('YYYY-MM-DD'));
        }

        return deliveries;
    }
}
