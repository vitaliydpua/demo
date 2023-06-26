import { ValidationError } from '@inft-common/error/validation.error';

import { ValidationErrorCodesEnum } from '../validation-error-codes.enum';


export class InvalidPhoneFormatError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.INVALID_PHONE_FORMAT_ERROR, 'Invalid phone number format');
  }
}
