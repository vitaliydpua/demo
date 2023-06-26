import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class UserByPhoneNotExistsError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.USER_BY_PHONE_NOT_EXISTS_ERROR, 'User with such phone number not exists');
  }
}
