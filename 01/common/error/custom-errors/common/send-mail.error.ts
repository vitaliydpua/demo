import { AppError } from '@inft-common/error/app.error';
import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';

export class SendMailError extends AppError {
  constructor() {
    super(ValidationErrorCodesEnum.SEND_MAIL_ERROR, 'Email service is not available');
  }
}
