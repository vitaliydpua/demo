import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class PinNotFoundError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.PIN_NOT_FOUND_ERROR, 'Pin code not found');
  }
}
