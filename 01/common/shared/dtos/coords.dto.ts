import { Required } from '@inft-common/decorators';
import { Latitude } from '@inft-common/decorators/location/latitude.decorator';
import { Longitude } from '@inft-common/decorators/location/longitude.decorator';

export class CoordsDto {
    @Latitude(Required.STRONG)
    latitude: number;

    @Longitude(Required.STRONG)
    longitude: number;
}
