import { Injectable, PipeTransform } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { ERedisKeySuffix } from "../shared/enums/redis-key-suffix.enum";
import { RedisCacheService } from "../shared/services/cache.service";
import { makeRedisKey } from "../helpers/make-redis-key";
import { EAuthProvider } from "@inft-app/auth/enums/auth-provider.enum";
import { AuthTokenNotFoundError } from "@inft-common/error/custom-errors/auth/auth-token-not-found.error";
import { InvalidAuthTokenError } from "@inft-common/error/custom-errors/auth/invalid-auth-token.error";


@Injectable()
export class AuthTokenValidator implements PipeTransform {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async transform(req: { authToken: string; phoneNumber?: string; email?: string; provider: EAuthProvider }) {
    const authTokenCachedValue = await this.redisCacheService.get(
      makeRedisKey(req.authToken, ERedisKeySuffix.authToken),
    );

    if (authTokenCachedValue === null) {
      throw new AuthTokenNotFoundError();
    }

    const key = req.provider === EAuthProvider.PHONE ? req.phoneNumber! : req.email!;
    const suffix = req.provider === EAuthProvider.PHONE ? ERedisKeySuffix.phoneNumber : ERedisKeySuffix.email;
    const tokensMatch = await bcrypt.compare(makeRedisKey(key, suffix), authTokenCachedValue);

    if (!tokensMatch) {
      throw new InvalidAuthTokenError();
    }

    return req;
  }
}
