import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class ProductCategoryIsNotYoursError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.CATEGORY_IS_NOT_YOURS_ERROR, 'Category is not yours');
  }
}
