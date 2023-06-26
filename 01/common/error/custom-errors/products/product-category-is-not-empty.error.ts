import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class ProductCategoryIsNotEmptyError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.CATEGORY_IS_NOT_EMPTY_ERROR, 'Category is not empty');
  }
}
