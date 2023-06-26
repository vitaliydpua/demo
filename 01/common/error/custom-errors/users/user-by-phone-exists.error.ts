import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class UserByPhoneExistsError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.USER_BY_PHONE_EXISTS_ERROR, 'User with such phone number already exists');
  }
}
