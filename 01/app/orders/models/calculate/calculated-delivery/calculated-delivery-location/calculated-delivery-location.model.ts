import { CoordsData } from '@inft-common/shared/interfaces/coords-data.interface';

export interface CalculatedDeliveryLocationModelData {
    country: string;
    city: string;
    postCode: string;
    street: string;
    building: string;
    coords: CoordsData;
}

export interface CalculatedDeliveryLocationModel extends CalculatedDeliveryLocationModelData {}

export class CalculatedDeliveryLocationModel {}
