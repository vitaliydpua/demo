import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// TODO: should handle errors properly, rethrowing them as http exceptions
@Injectable()
export class RedisCacheService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager) {}

  public async set(
    key: string,
    value: string | number,
    ttl: number,
  ): Promise<string> {
    return from(this.cacheManager.set(key, value, { ttl }))
      .pipe(
        map(String),
        catchError((err) =>
          throwError(new HttpException(err.message, HttpStatus.BAD_REQUEST)),
        ),
      )
      .toPromise();
  }

  public async get(key: string): Promise<string | null> {
    return from(this.cacheManager.get(key))
      .pipe(
        map(value => value ? String(value) : null),
      )
      .toPromise();
  }

  public delete(key: string): void {
    try {
      this.cacheManager.del(key);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async hasKey(key: string): Promise<boolean> {
    return from(this.cacheManager.keys(key))
      .pipe(
        map((res: any) => Boolean(res.length)),
        catchError((err) =>
          throwError(new HttpException(err.message, HttpStatus.BAD_REQUEST)),
        ),
      )
      .toPromise();
  }
}
