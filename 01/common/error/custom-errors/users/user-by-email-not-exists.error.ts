import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class UserByEmailNotExistsError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.USER_BY_EMAIL_NOT_EXISTS_ERROR, 'User with such email not exists');
  }
}
