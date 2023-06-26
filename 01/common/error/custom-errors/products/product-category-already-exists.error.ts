import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class ProductCategoryAlreadyExistsError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.PRODUCT_CATEGORY_ALREADY_EXISTS_ERROR, 'Category exists');
  }
}
