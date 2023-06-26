import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LogEntryFactory } from '../shared/models/log-entry/log-entry.factory';
import { RequestProfileFactory } from '../shared/models/request-profile/request-profile.factory';
import { ResponseProfileFactory } from '../shared/models/response-profile/response-profile.factory';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestProfile = new RequestProfileFactory().getModelFromData({
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
      url: request.url,
    });

    const startTime = moment().utc();
    const logEntry = new LogEntryFactory().getModelFromData({
      request: requestProfile,
      requestDate: startTime,
    });
    return next.handle().pipe(
      tap((data) => {
        const endTime = moment().utc();
        const response = context.switchToHttp().getResponse<Response>();
        const responseProfile = new ResponseProfileFactory().getSuccessData(response.statusCode, data);

        this.logger.log(
          new LogEntryFactory().getModelFromData({
            ...logEntry,
            response: responseProfile,
            responseDate: endTime,
            executionTimeInMilliseconds: endTime.valueOf() - startTime.valueOf(),
          })
        );
      }),

      catchError((err) => {
        const endTime = moment().utc();

        this.logger.error(
          new LogEntryFactory().getModelFromData({
            ...logEntry,
            response: new ResponseProfileFactory().getModelFromData({
              data: err,
            }),
            responseDate: moment().utc(),
            executionTimeInMilliseconds: endTime.valueOf() - startTime.valueOf(),
          })
        );
        return throwError(err);
      }),
    );
  }
}

