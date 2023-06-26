import {Request} from 'express';
import basicAuth from 'basic-auth';
import {WebError} from 'app/lib/interfaces/web/WebError';
import {IAuth} from 'app/lib/interfaces/auth.types';
import {RpcError} from 'rpc/lib/RpcError';
import {UserServiceClient} from 'rpc/lib/UserServiceClient';
import {BankingServiceClient} from 'rpc/lib/BankingServiceClient';
import {Logger} from 'app/lib/app/Logger';
import { AppServiceClient } from 'rpc/lib/AppServiceClient';
import { ERROR_CODE_UNIQUE } from 'app/lib/app/AppError';


export class SessionAuth implements IAuth {

	constructor (
		protected logger: Logger,
		protected userServiceClient: UserServiceClient,
		protected bankingServiceClient: BankingServiceClient,
		protected appServiceClient: AppServiceClient,
	) {}

	public async credentials (req: Request): Promise<basicAuth.BasicAuthResult> {
		const credentials = basicAuth(req);

		if (credentials) {
			return credentials;

		} else {
			throw new WebError(401, 'UNAUTHENTICATED', 'No credentials', undefined, undefined, ERROR_CODE_UNIQUE.NO_CREDENTIALS);
		}
	}

	public async auth (req: Request, credentials: basicAuth.BasicAuthResult): Promise<Request['auth']> {
		try {
			this.logger.addIdsToTrace({
				sessionId: credentials.name,
			});

			this.logger.debug('auth', {
				step:   'start',
				target: 'SESSION',
			});

			const installationId = req.header('installation-id');
			if (installationId) {
				await this.appServiceClient.checkInstallationVersion({
					installationId: installationId,
				});
			}

			const result = await this.userServiceClient.authSession({
				sessionId: credentials.name,
				secret:    credentials.pass,
			});

			if (!installationId) {
				await this.appServiceClient.checkInstallationVersion({
					installationId: result.installationId,
				});
			}

			await this.userServiceClient.updateLastActivity({
				sessionId: result.sessionId,
			});

			this.logger.addIdsToTrace({
				phone:          result.phone,
				userId:         result.userId,
				installationId: result.installationId,
			});

			this.logger.debug('auth', {
				step:   'end',
				target: 'SESSION',
			});

			return {
				sessionId:      result.sessionId,
				phone:          result.phone,
				userId:         result.userId,
				installationId: result.installationId,
				cacheUpdatedAt: result.cacheUpdatedAt,
			};

		} catch (err: any) {
			this.logger.debug('auth', {
				step:   'end',
				target: 'SESSION',
				error:  err,
			});

			if (err instanceof RpcError) {
				if (err.message === 'Request validation failed in data') {
					throw new WebError(401, 'UNAUTHENTICATED', 'Session not found', undefined, undefined, ERROR_CODE_UNIQUE.SESSION_NOT_FOUND);
				} else if (err.data?.appError?.code === 'UNSUPPORTED VERSION') {
					throw new WebError(401, 'UNAUTHENTICATED', err.message, err.data?.appError?.details || undefined, undefined, ERROR_CODE_UNIQUE.UNAUTHENTICATED_LOWER_VERSION);
				} else {
					throw new WebError(401, 'UNAUTHENTICATED', err.message, undefined, undefined, err.errorCode);
				}
			} else {
				throw err;
			}
		}
	}
}
