import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class AuthTokenNotFoundError extends ValidationError {
    constructor() {
        super(ValidationErrorCodesEnum.AUTH_TOKEN_NOT_FOUND_ERROR, 'Auth token not found');
    }
}
