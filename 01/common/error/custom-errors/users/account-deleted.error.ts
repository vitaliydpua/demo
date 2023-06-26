import { ValidationErrorCodesEnum } from '@inft-common/error/custom-errors/validation-error-codes.enum';
import { ValidationError } from '@inft-common/error/validation.error';

export class AccountDeletedError extends ValidationError {
    constructor() {
        super(ValidationErrorCodesEnum.ACCOUNT_DELETED_ERROR, 'Account deleted');
    }
}
