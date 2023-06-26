import * as jo from 'joi';

export const mailerValidationSchema = {
    MAILER_SENDER_EMAIL: jo.string().required(),
    MAILER_EMAIL_SUBJECT: jo.string().required(),
    MAILER_CONFIRM_LINK: jo.string().required(),
    SENDGRID_API_KEY: jo.string().required(),
    MAIL_PIN_TTL: jo.string().required(),
};
