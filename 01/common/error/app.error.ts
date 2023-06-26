/**
 * Уровень ошибки. Используется в обработчике ошибок, для понимания с каким уовнем логировать
 */
export enum ErrorHandleTypes {
    LOG_INFO = 1 << 1, // логировать с уровнем info, иначе будет уровень error
    RETURN_RESULT = 1 << 2, // возвращать ошибку в ответе
}

export enum ErrorHandleMaskPreset {
    DEFAULT = ~ErrorHandleTypes.LOG_INFO | ErrorHandleTypes.RETURN_RESULT,
}

/**
 * Общий предок для всех ошибок приложения
 */
export class AppError extends Error {
    public readonly handleMask = ErrorHandleMaskPreset.DEFAULT;
    constructor(public readonly code?: any, message?: string, public readonly context?: string) {
        super(message);
    }
}
