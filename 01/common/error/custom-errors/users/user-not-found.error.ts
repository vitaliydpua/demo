import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class UserNotFoundError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.USER_NOT_FOUND_ERROR, 'User was not found');
  }
}
