import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {WalletServiceClient} from 'rpc/lib/WalletServiceClient';
import { PaymentServiceClient } from 'rpc/lib/PaymentServiceClient';


export class WalletController {

	constructor (
		private walletServiceClient: WalletServiceClient,
		private paymentServiceClient: PaymentServiceClient,
	) {}

	@handler({
		auth:  AuthType.Signature,
		audit: {
			category: AuditCategory.WALLET,
			action:   AuditAction.verifyCard,
		},
		description: 'Verifies given card',
		method:      'POST',
		path:        '/wallet/cards/verify',
		validate:    {
			body: joi.object().keys({
				pan:       joi.string().creditCard().required(),
				expiresAt: joi.string().required(),
				cvv:       joi.string().length(3).regex(/^\d+$/).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				paymentId: joi.string().guid().required(),
			}),
		},
	})
	public async verifyCard (req: RequestObj): Promise<{ paymentId: string }> {
		const result = await this.paymentServiceClient.startCardVerification({
			counterpartyId: req.auth.counterpartyId!,
			cvv:            req.body.cvv,
			expiresAt:      req.body.expiresAt,
			pan:            req.body.pan,
		});

		return {
			paymentId: result.paymentId,
		};
	}

	@handler({
		auth:  AuthType.User,
		audit: {
			category: AuditCategory.WALLET,
			action:   AuditAction.verifyCard,
		},
		description: 'Verifies given card (for auth: User)',
		method:      'POST',
		path:        '/wallet/user/cards/verify',
		validate:    {
			body: joi.object().keys({
				pan:       joi.string().creditCard().required(),
				expiresAt: joi.string().required(),
				cvv:       joi.string().length(3).regex(/^\d+$/).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				paymentId: joi.string().guid().required(),
			}),
		},
	})
	public async verifyCardForUser (req: RequestObj): Promise<{ paymentId: string }> {
		const result = await this.paymentServiceClient.startCardVerification({
			counterpartyId: req.auth.counterpartyId!,
			cvv:            req.body.cvv,
			expiresAt:      req.body.expiresAt,
			pan:            req.body.pan,
		});

		return {
			paymentId: result.paymentId,
		};
	}

	@handler({
		description: 'List cards from wallet',
		method:      'GET',
		path:        '/wallet/cards',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.WALLET,
			action:   AuditAction.getListOfCards,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					source: joi.string(),
					status: joi.string(),
					text:   joi.string(),
				}),
				limit: joi.number().positive().integer(),
				skip:  joi.number().positive().integer().allow(0),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:                      joi.string().required(),
							isVerified:              joi.string().required(),
							name:                    joi.string().required(),
							firstDigits:             joi.string().required(),
							lastDigits:              joi.string().required(),
							source:                  joi.string().required(),
							status:                  joi.string().required(),
							designCode:              joi.string().required(),
							createdAt:               joi.date().required(),
							expiresAt:               joi.string().allow(null).required(),
							showOperationsInHistory: joi.boolean().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listCards (req: RequestObj): Promise<object> {
		const filter: {
			source?: string;
			status?: string;
			text?: string;
		} = {};

		if (req.query.filter) {
			filter.text = req.query.filter.text;
			filter.status = req.query.filter.status;
			filter.source = req.query.filter.source;
		}

		const result = await this.walletServiceClient.listCards({
			filter: {
				counterpartyId: req.auth.counterpartyId!,
				source:         filter.source,
				bankStatus:     filter.status,
				text:           filter.text,
			},
			limit: req.query.limit,
			skip:  req.query.skip,
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					id:                      item.id,
					isVerified:              item.isVerified,
					name:                    item.name,
					firstDigits:             item.firstDigits,
					lastDigits:              item.lastDigits,
					source:                  item.source,
					status:                  item.status,
					bankStatus:              item.bankStatus,
					designCode:              item.designCode,
					createdAt:               item.createdAt,
					expiresAt:               item.expiresAt,
					showOperationsInHistory: item.showOperationsInHistory,
				};
			}),
		};
	}

	@handler({
		description: 'Update card bankStatus',
		method:      'PATCH',
		path:        '/wallet/cards/bankStatus',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.WALLET,
			action:   AuditAction.modifyCard,
		},
		validate: {
			body: joi.object().keys({
				cards: joi.array().items({
					cardId:     joi.string().required(),
					bankStatus: joi.string().required(),
				}),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardsIds: joi.array().items(joi.string().required()),
				}),
			}),
		},
	})
	public async updateListCardsBankStatus (req: RequestObj): Promise<object> {
		const result = await this.walletServiceClient.updateListCardsBankStatus({
			counterpartyId: req.auth.counterpartyId!,
			cards:          req.body.cards.map((it: any) => {
				return {
					cardId:     it.cardId,
					bankStatus: it.bankStatus,
				};
			}),
		});

		return {
			cardsIds: result.cardsIds,
		};
	}

	@handler({
		description: 'Update card name',
		method:      'PATCH',
		path:        '/wallet/cards/:cardId/',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.WALLET,
			action:   AuditAction.modifyCard,
		},
		validate: {
			body: joi.object().keys({
				name:                    joi.string().trim().allow(null).allow(''),
				showOperationsInHistory: joi.boolean(),
			}),
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardId: joi.string().required(),
				}),
			}),
		},
	})
	public async updateCard (req: RequestObj): Promise<object> {
		const result = await this.walletServiceClient.updateCard({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
			body:           {
				name:                    req.body.name,
				showOperationsInHistory: req.body.showOperationsInHistory,
			},
		});

		return {
			cardId: result.cardId,
		};
	}

	@handler({
		description: 'Show card data',
		method:      'GET',
		path:        '/wallet/cards/:cardId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.WALLET,
			action:   AuditAction.getCardData,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:                      joi.string().required(),
					isVerified:              joi.string().required(),
					name:                    joi.string().required(),
					firstDigits:             joi.string().required(),
					lastDigits:              joi.string().required(),
					pan:                     joi.string().required(),
					expiresAt:               joi.string().required(),
					source:                  joi.string().required(),
					status:                  joi.string().required(),
					bankStatus:              joi.string().required(),
					designCode:              joi.string().required(),
					createdAt:               joi.date().required(),
					showOperationsInHistory: joi.boolean().required(),
				}),
			}),
		},
	})
	public async showCard (req: RequestObj): Promise<object> {
		const result = await this.walletServiceClient.showCard({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
		});

		return {
			id:                      result.id,
			isVerified:              result.isVerified,
			name:                    result.name,
			firstDigits:             result.firstDigits,
			lastDigits:              result.lastDigits,
			pan:                     result.pan,
			expiresAt:               result.expiresAt,
			source:                  result.source,
			status:                  result.status,
			bankStatus:              result.bankStatus,
			designCode:              result.designCode,
			createdAt:               result.createdAt,
			showOperationsInHistory: result.showOperationsInHistory,
		};
	}

	@handler({
		description: 'Delete card',
		method:      'DELETE',
		path:        '/wallet/cards/:cardId/',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.WALLET,
			action:   AuditAction.deleteCard,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardId: joi.string().required(),
				}),
			}),
		},
	})
	public async deleteCard (req: RequestObj): Promise<object> {
		const result = await this.walletServiceClient.deleteCard({
			cardId:         req.params.cardId,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			cardId: result.cardId,
		};
	}
}
