import { Injectable } from '@nestjs/common';
import { JwtPayloadData } from '@inft-app/auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HelpersService {
    constructor(private readonly jwtService: JwtService) {
    }

    getJwtPayloadByHeader(authHeader: string): JwtPayloadData | null {
        const [_, bearerToken] = authHeader
            .split('Bearer')
            .map((val) => val.trim());
        const result = this.jwtService.decode(bearerToken);

        return result ? this.jwtService.decode(bearerToken) as JwtPayloadData : null;
    }
}
