import { HttpException, HttpStatus } from '@nestjs/common';

import { ModelFactory } from '../../../abstract/model-factory.abstract';

import { ResponseProfileModel, ResponseProfileModelData } from './response-profile.model';
import { sanitizeObject } from "@inft-common/helpers/sanitize-object.helper";

export class ResponseProfileFactory extends ModelFactory<ResponseProfileModelData, ResponseProfileModel> {
  protected getInstance(): ResponseProfileModel {
    return new ResponseProfileModel();
  }

  public getErrorData(statusCode: number, data: any): ResponseProfileModel {
    const error: HttpException =
        data instanceof HttpException
            ? data
            : new HttpException(
                { message: data?.message, stack: data?.stack },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );

    return this.getModelFromData({
      statusCode,
      data: error.getResponse(),
    });
  }

  public getSuccessData(statusCode: number, data: any): ResponseProfileModel {
    return this.getModelFromData(sanitizeObject({
      statusCode,
      data
    }));
  }
}

