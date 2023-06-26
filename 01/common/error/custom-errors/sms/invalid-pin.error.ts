import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class InvalidPinError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.INVALID_PIN_ERROR, 'Invalid pin code');
  }
}
