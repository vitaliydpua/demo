import {Request} from 'express';
import {BasicAuthResult} from 'basic-auth';
import {WebError} from 'app/lib/interfaces/web/WebError';
import {SessionAuth} from './SessionAuth';
import { ERROR_CODE_UNIQUE } from 'app/lib/app/AppError';


export class PhoneAuth extends SessionAuth {

	public async auth (req: Request, credentials: BasicAuthResult): Promise<Request['auth']> {
		try {
			this.logger.addIdsToTrace({
				sessionId: credentials.name,
			});

			this.logger.debug('auth', {
				step:   'start',
				target: 'PHONE',
			});

			const authData = await super.auth(req, credentials);

			if (authData.phone) {
				this.logger.debug('auth', {
					step:   'end',
					target: 'PHONE',
				});

				return authData;

			} else {
				throw new WebError(403, 'UNAUTHORIZED', 'Insufficient scope', undefined, undefined, ERROR_CODE_UNIQUE.UNAUTHORIZED_INSUFFICIENT_SCOPE);
			}

		} catch (err: any) {
			this.logger.debug('auth', {
				step:   'end',
				target: 'PHONE',
				error:  err,
			});

			if (err instanceof WebError) {
				throw err;
			} else {
				throw WebError.from(err);
			}
		}
	}
}
