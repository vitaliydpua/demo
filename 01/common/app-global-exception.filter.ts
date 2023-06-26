import { AppError, ErrorHandleTypes } from '@inft-common/error/app.error';
import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { InvalidArgumentError } from '@inft-common/error/invalid-argument.error';
import { ValidationError } from '@inft-common/error/validation.error';
import { AppEnvironment } from '@inft-common/shared/enums/app-environment.enum';
import { AppConfigService } from '@inft-config/app/app-config.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: HttpStatus;
  errors?: {
    code: string;
    message: string[];
  };
}

@Catch()
export class AppGlobalExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly appConfigService: AppConfigService,
  ) {}

  catch(error: any, host: ArgumentsHost) {
    if (this.appConfigService.nodeEnv === AppEnvironment.Development) {
      console.error(error);
    }
    const appResponse = host.switchToHttp().getResponse<Response>();

    let result: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errors: { code: ValidationErrorCodesEnum.INTERNAL_SERVER_ERROR, message: ['Internal server error'] },
    };

    if (error instanceof AppError) {
      result = this.handleAppException(error);
    } else if (error instanceof HttpException) {
      result = this.handleHttpException(error);
    } else {
      this.logger.error(error);
    }
    appResponse.status(result.statusCode).json(result);
  }

  private handleAppException(exception: AppError): ErrorResponse {
    const result: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception.handleMask & ErrorHandleTypes.LOG_INFO) {
      this.logger.log(exception);
    } else {
      this.logger.error(exception);
    }

    if (exception.handleMask & ErrorHandleTypes.RETURN_RESULT) {
      result.errors = this.appExceptionAsObject(exception);
    }

    if (exception instanceof InvalidArgumentError || exception instanceof ValidationError) {
      result.statusCode = HttpStatus.BAD_REQUEST;
    }

    return result;
  }

  private handleHttpException(exception: HttpException): ErrorResponse {
    const response = exception.getResponse();
    let message: string[] = [];

    if (typeof response === 'object') {
      message = Array.isArray((response as any).message) ? (response as any).message : [(response as any).message];
    } else {
      message = typeof response === 'string' ? [response] : response;
    }

    this.logger.error(exception);

    return {
      statusCode: exception.getStatus(),
      errors: { code: ValidationErrorCodesEnum.VALIDATION_ERROR, message },
    };
  }

  private appExceptionAsObject(exception: AppError) {
    return {
      code: exception.code,
      message: [exception.message],
    };
  }
}
