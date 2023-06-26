import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class InvalidAuthTokenError extends ValidationError {
    constructor() {
        super(ValidationErrorCodesEnum.INVALID_AUTH_TOKEN_ERROR, 'Invalid auth token');
    }
}
