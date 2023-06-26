/**
 * Ошибка передачи невалидных данных от пользователя
 */
import { AppError, ErrorHandleMaskPreset, ErrorHandleTypes } from './app.error';

export class InvalidArgumentError extends AppError {
    // включаем логиривание как info
    public readonly handleMask = ErrorHandleMaskPreset.DEFAULT | ErrorHandleTypes.LOG_INFO;
    constructor(message?: string, context?: string) {
        super('validation_error', message, context);
    }
}
