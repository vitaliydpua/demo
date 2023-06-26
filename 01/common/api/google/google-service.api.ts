import { GoogleServiceApiConfigProvider } from '@inft-common/api/config/google-config.provider';
import { CoordsData } from '@inft-common/shared/interfaces/coords-data.interface';
import { Injectable } from '@nestjs/common';
import * as googleDistanceMatrix from 'google-distance-matrix';
import { Observable, Subject } from 'rxjs';

export interface GoogleServiceApiConfig {
    apiKey: string;
}

@Injectable()
export class GoogleServiceApi {
    constructor(private readonly googleConfigProvider: GoogleServiceApiConfigProvider) {
        googleDistanceMatrix.key(googleConfigProvider.getConfig().apiKey);
        googleDistanceMatrix.mode('driving');

        // this.calculateDistances({ latitude: 50.2559674, longitude: 19.0234891 }, [{
        //     latitude: 50.2602984,
        //     longitude: 19.0112531
        // }]).subscribe(console.log);
    }

    calculateDistances(origin: CoordsData, destinations: CoordsData[]): Observable<number[]> {
        const subject = new Subject<number[]>();

        googleDistanceMatrix.matrix([
                this._coordsToString(origin.latitude, origin.longitude)],
            destinations.map(d => (this._coordsToString(d.latitude, d.longitude))),
            (err, distances) => {
                if (!err) {
                    subject.next(distances.rows[0].elements
                        .filter(el => el.status === 'OK')
                        .map(el => el.distance.value) as number[]
                    );
                    subject.complete();
                } else {
                    console.log(err);
                }
            });

        return subject.asObservable();
    }

    private _coordsToString(latitude: number, longitude: number): string {
        return `${latitude},${longitude}`;
    }
}
