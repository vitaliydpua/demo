import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class ProductActivityNotSupportedError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.PRODUCT_ACTIVITY_NOT_SUPPORTED_ERROR, 'Product activity not supported');
  }
}
