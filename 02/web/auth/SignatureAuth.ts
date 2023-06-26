import crypto from 'crypto';
import {Request} from 'express';
import {BasicAuthResult} from 'basic-auth';
import jwt, {JsonWebTokenError} from 'jsonwebtoken';
import {WebError} from 'app/lib/interfaces/web/WebError';
import {UserAuth} from './UserAuth';


export class SignatureAuth extends UserAuth {
	private iatShift = 60;

	public async auth (req: Request, credentials: BasicAuthResult): Promise<Request['auth']> {
		try {
			this.logger.addIdsToTrace({
				sessionId: credentials.name,
			});

			this.logger.debug('auth', {
				step:   'start',
				target: 'SIGNATURE',
			});

			const authData = await super.auth(req, credentials);

			if (!req.headers['x-signature']) {
				throw new WebError(401, 'UNAUTHENTICATED', 'X-SIGNATURE header is not found');
			}

			if (authData.counterpartyId) {
				const counterparty = await this.bankingServiceClient.showCounterparty({
					counterpartyId: authData.counterpartyId,
				});

				if (['ACTIVE', 'DEBIT_BLOCKED'].includes(counterparty.status) && counterparty.activatedAt) {
					authData.publicKey = counterparty.publicKey;

					const isSignatureCorrect = this.verifySignature(req, authData.publicKey);

					if (isSignatureCorrect) {
						authData.requestToken = String(req.headers['x-signature']);

						this.logger.debug('auth', {
							step:   'end',
							target: 'SIGNATURE',
							data:   {
								counterpartyStatus: counterparty.status,
							},
						});

						return authData;

					} else {
						throw new WebError(403, 'UNAUTHORIZED', 'Signature is wrong');
					}
				} else {
					throw new WebError(403, 'UNAUTHORIZED', 'Counterparty is not active');
				}
			} else {
				throw new WebError(403, 'UNAUTHORIZED', 'Insufficient scope, not counterparty');
			}

		} catch (err: any) {
			this.logger.debug('auth', {
				step:   'end',
				target: 'SIGNATURE',
				error:  err,
			});

			if (err instanceof WebError) {
				throw err;
			} else {
				throw WebError.from(err);
			}
		}
	}

	private verifySignature (req: Request, publicKey: string): boolean {
		const now = Math.floor(Date.now() / 1000);

		const token    = String(req.headers['x-signature']);
		const method   = req.method.toUpperCase();
		const url      = req.originalUrl;
		const rawBody  = req.rawBody && req.rawBody.toString('utf-8') || '';
		const bodyHash = crypto.createHash('sha256').update(rawBody).digest('hex').toUpperCase();

		try {
			const payload: any = jwt.verify(token, publicKey);

			if (!payload.iat) {
				throw new WebError(401, 'UNAUTHENTICATE', 'JWT token does not have iat');
			}

			if (Math.abs(payload.iat - now) > this.iatShift) {
				throw new WebError(401, 'UNAUTHENTICATE', `JWT token is too old. iat: ${payload.iat}, now: ${now}`);
			}

			if (payload.method !== method) {
				throw new WebError(401, 'UNAUTHENTICATE', `JWT token method incorrect. method: ${payload.method}, real: ${method}`);
			}

			if (payload.url !== url) {
				throw new WebError(401, 'UNAUTHENTICATE', `JWT token url incorrect. url: ${payload.url}, real: ${url}`);
			}

			if (payload.bodyHash !== bodyHash) {
				throw new WebError(401, 'UNAUTHENTICATE', `JWT token bodyHash incorrect. bodyHash: ${payload.bodyHash}, real: ${bodyHash}`);
			}

			return true;

		} catch (err: any) {
			if (err instanceof WebError) {
				throw err;

			} else if (err instanceof JsonWebTokenError) {
				throw new WebError(401, 'UNAUTHENTICATED', err.message);

			} else {
				throw new WebError(401, 'UNAUTHENTICATED', 'Failed to verify signature');
			}
		}
	}
}
