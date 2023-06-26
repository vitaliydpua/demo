import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class ProductExistsError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.PRODUCT_EXISTS_ERROR, 'Product exists');
  }
}
