import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class NotSupportedRoleError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.NOT_SUPPORTED_ROLE_ERROR, 'This role doesn\'t support');
  }
}
