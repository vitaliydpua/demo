import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class LoginProviderNotFoundError extends ValidationError {
    constructor() {
        super(ValidationErrorCodesEnum.LOGIN_PROVIDER_NOT_FOUND_ERROR, 'Login provider not found');
    }
}
