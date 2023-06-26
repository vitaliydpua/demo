import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class TwilioUnavailableError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.TWILIO_UNAVAILABLE_ERROR, 'Twilio service unavailable');
  }
}
