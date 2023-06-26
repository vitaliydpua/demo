import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class UserByEmailExistsError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.USER_BY_EMAIL_EXISTS_ERROR, 'User with such email already exists');
  }
}
