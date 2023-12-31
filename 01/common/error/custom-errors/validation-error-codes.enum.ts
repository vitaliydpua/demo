export enum ValidationErrorCodesEnum {
    VALIDATION_ERROR = 'validation',
    USER_NOT_FOUND_ERROR = 'user_not_found',
    ACCOUNT_DELETED_ERROR = 'account_deleted',
    LOGIN_PROVIDER_NOT_FOUND_ERROR = 'login_provider_not_found',
    AUTH_TOKEN_NOT_FOUND_ERROR = 'auth_token_not_found',
    INVALID_AUTH_TOKEN_ERROR = 'invalid_auth_token',
    INTERNAL_SERVER_ERROR = 'internal_server',
    INVALID_REFRESH_TOKEN_ERROR = 'invalid_refresh_token',
    INVALID_IMAGE_FORMAT_ERROR = 'invalid_image_format',
    SEND_MAIL_ERROR = 'send_mail',
    USER_BY_PHONE_NOT_EXISTS_ERROR = 'user_by_phone_not_exists',
    USER_BY_PHONE_EXISTS_ERROR = 'user_by_phone_exists',
    USER_BY_EMAIL_EXISTS_ERROR = 'user_by_email_exists',
    NOT_SUPPORTED_ROLE_ERROR = 'not_supported_role',
    USER_BY_EMAIL_NOT_EXISTS_ERROR = 'user_by_email_not_exists',
    INVALID_PIN_ERROR = 'invalid_pin',
    PRODUCT_CATEGORY_ALREADY_EXISTS_ERROR = 'product_category_already_exists',
    PRODUCT_ACTIVITY_NOT_SUPPORTED_ERROR = 'product_activity_not_supported',
    CATEGORY_IS_NOT_EMPTY_ERROR = 'category_is_not_empty',
    CATEGORY_IS_NOT_YOURS_ERROR = 'category_is_not_yours',
    PRODUCT_EXISTS_ERROR = 'product_exists',
    INVALID_PHONE_FORMAT_ERROR = 'invalid_phone_format',
    PIN_NOT_FOUND_ERROR = 'pin_not_found',
    TWILIO_UNAVAILABLE_ERROR = 'twilio_unavailable',
}
