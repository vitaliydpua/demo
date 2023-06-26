import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class InvalidRefreshTokenError extends ValidationError {
  constructor() {
    super(ValidationErrorCodesEnum.INVALID_REFRESH_TOKEN_ERROR, 'Invalid refresh token or jwt token');
  }
}
