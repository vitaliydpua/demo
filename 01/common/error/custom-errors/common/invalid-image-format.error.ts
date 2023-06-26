import { ValidationError } from '../../validation.error';
import { ValidationErrorCodesEnum } from '../validation-error-codes.enum';

export class InvalidImageFormatError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.INVALID_IMAGE_FORMAT_ERROR, 'Only image files in the format (jpg, jpeg, png) are allowed');
  }
}
