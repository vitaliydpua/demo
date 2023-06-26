import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {CryptoServiceClient} from 'rpc/lib/CryptoServiceClient';


export class CryptoController {

	constructor (
		private cryptoServiceClient: CryptoServiceClient,
	) {}

	@handler({
		description: 'Creates a new card or return an id of existent',
		method:      'POST',
		path:        '/crypto/cards',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				pan:        joi.string().creditCard().required(),
				expiresAt:  joi.date().iso().raw(),
				holderName: joi.string().trim(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async showCryptoBody (req: RequestObj): Promise<object> {
		const result = await this.cryptoServiceClient.createCard({
			pan:        req.body.pan,
			expiresAt:  req.body.expiresAt,
			holderName: req.body.holderName,
		});

		return {
			cardId: result.cardId,
		};
	}
}
