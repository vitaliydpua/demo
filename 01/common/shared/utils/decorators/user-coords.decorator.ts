import { CoordsData } from '@inft-common/shared/interfaces/coords-data.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const UserCoords = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const headers = request.headers;

        return {
            latitude: headers['x-coords-latitude'],
            longitude: headers['x-coords-longitude'],
        } as CoordsData;
    },
);
