import { ERedisKeySuffix } from '../shared/enums/redis-key-suffix.enum';

export const makeRedisKey = (
  param: string,
  suffix: ERedisKeySuffix,
): string => {
  return `${param}-${suffix}`;
};
