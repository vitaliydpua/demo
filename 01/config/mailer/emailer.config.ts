import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
    sender_email: process.env.MAILER_SENDER_EMAIL,
    email_subject: process.env.MAILER_EMAIL_SUBJECT,
    confirm_email_link: process.env.MAILER_CONFIRM_LINK,
    send_grid_api_key: process.env.SENDGRID_API_KEY,
    pin_ttl: process.env.MAIL_PIN_TTL,
}));
