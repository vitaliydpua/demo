import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {CardServiceClient} from 'rpc/lib/CardServiceClient';


export class CardController {

	constructor (
		private cardServiceClient: CardServiceClient,
	) {}

	@handler({
		description: 'List cards',
		method:      'GET',
		path:        '/cards',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.getListOfCards,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:              joi.string().required(),
							name:            joi.string().allow(null).required(),
							firstDigits:     joi.string().required(),
							lastDigits:      joi.string().required(),
							currency:        joi.string().required(),
							ownBalance:      joi.number().allow(null).required(),
							totalBalance:    joi.number().allow(null).required(),
							creditLimit:     joi.number().allow(null).required(),
							status:          joi.string().required(),
							allowedActions:  joi.array().items(joi.string()),
							productCode:     joi.string().allow(null).required(),
							designCode:      joi.string().allow(null).required(),
							googlePayToken:  joi.string().allow(null).required(),
							cardReissueCost: joi.number().allow(null).required(),
							expiresAt:       joi.string().allow(null).required(),
							atmsPartners:    joi.array().items(joi.string()).required(),
						}),
					),
				}),
			}),
		},
	})
	public async listCards (req: RequestObj): Promise<any> {
		const result = await this.cardServiceClient.listUsefulCards({
			counterpartyId:          req.auth.counterpartyId!,
			fetchProcessingCardInfo: true,
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					id:             item.id,
					name:           item.name,
					firstDigits:    item.firstDigits,
					lastDigits:     item.lastDigits,
					currency:       item.currency,
					ownBalance:     item.ownBalance,
					totalBalance:   item.totalBalance,
					creditLimit:    item.creditLimit,
					status:         item.status,
					allowedActions: item.allowedActions,
					productCode:    item.productCode,
					designCode:     item.designCode,
					expiresAt:      item.expiresAt,
					atmsPartners:   item.atmsPartners,
				};
			}),
		};
	}

	@handler({
		description: 'Update card name',
		method:      'PATCH',
		path:        '/cards/:cardId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.rename,
		},
		validate: {
			body: joi.object().keys({
				name: joi.string().trim().allow(null).allow(''),
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
		const result = await this.cardServiceClient.updateCard({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
			name:           req.body.name,
		});

		return {
			cardId: result.cardId,
		};
	}

	@handler({
		description: 'Get list allowed foreign currencies',
		method:      'GET',
		path:        '/cards/foreign-currencies',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.getCardReissueCost,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					foreignCurrencies: joi.array().items(joi.object().keys({
						currency: joi.string().required(),
						status:   joi.string().valid('NOT_ISSUE', 'IN_PROGRESS_ISSUE', 'COMPLETED_ISSUE').required(),
					})).required(),
				}),
			}),
		},
	})
	public async getListAllowedForeignCurrencies (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.getListAllowedForeignCurrencies({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			foreignCurrencies: result.foreignCurrencies,
		};
	}

	@handler({
		description: 'Show card data',
		method:      'GET',
		path:        '/cards/:cardId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
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
					id:             joi.string().required(),
					name:           joi.string().allow(null).required(),
					firstDigits:    joi.string().required(),
					lastDigits:     joi.string().required(),
					pan:            joi.string().required(),
					currency:       joi.string().required(),
					allowedActions: joi.array().items(joi.string()),
					expiresAt:      joi.string().required(),
					ownBalance:     joi.number().allow(null).required(),
					totalBalance:   joi.number().allow(null).required(),
					creditLimit:    joi.number().allow(null).required(),
					status:         joi.string().required(),
					limits:         joi.object().keys({
						currency:         joi.string().required(),
						internetLimit:    joi.number().positive().allow(null).required(),
						internetLimitMax: joi.number().positive().allow(null).required(),
					}).allow(null),
					googlePayTokens: joi.object().keys({
						token:   joi.string().required(),
						tokenId: joi.string().allow(null).required(),
					}).allow(null),
					applePayTokens: joi.object().keys({
						token:   joi.string().required(),
						tokenId: joi.string().allow(null).required(),
					}).allow(null),
					cardReissueCost:      joi.number().allow(null).required(),
					localizedDescription: joi.string().required(),
				}),
			}),
		},
	})
	public async showCard (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.showCardExtended({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
			installationId: req.auth.installationId!,
		});

		return {
			id:             result.id,
			name:           result.name,
			firstDigits:    result.firstDigits,
			lastDigits:     result.lastDigits,
			pan:            result.pan,
			currency:       result.currency,
			allowedActions: result.allowedActions,
			expiresAt:      result.expiresAt,
			ownBalance:     result.ownBalance,
			totalBalance:   result.totalBalance,
			creditLimit:    result.creditLimit,
			status:         result.status,
			productCode:    result.productCode,
			designCode:     result.designCode,
			limits:         result.limits && {
				currency:         result.limits.currency,
				internetLimit:    result.limits.internetLimit,
				internetLimitMax: result.limits.internetLimitMax,
			},
			googlePayTokens: (result.googlePayTokens || []).map((tokenInfo) => {
				return {
					token:   tokenInfo.token,
					tokenId: tokenInfo.tokenId,
				};
			}),
			applePayTokens: (result.applePayTokens || []).map((tokenInfo) => {
				return {
					token:   tokenInfo.token,
					tokenId: tokenInfo.tokenId,
				};
			}),
			localizedDescription: result.localizedDescription,
		};
	}

	@handler({
		description: 'Get card CVV',
		method:      'GET',
		path:        '/cards/:cardId/cvv',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.getCardCVV,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cvv: joi.string().required(),
				}),
			}),
		},
	})
	public async getCardCvv (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.getCardCvv({
			cardId:         req.params.cardId,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			cvv: result.cvv,
		};
	}

	@handler({
		description: 'Update card token',
		method:      'PATCH',
		path:        '/cards/:cardId/token',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.modifyCardToken,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
			body: joi.object().keys({
				googlePayToken: joi.string().required(),
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
	public async updateCardToken (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.updateCardToken({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
			googlePayToken: req.body.googlePayToken,
		});

		return {
			cardId: result.cardId,
		};
	}

	@handler({
		description: 'Create first card by QR-code (cardId from UPC)',
		method:      'POST',
		path:        '/cards/provisioning',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.prepareProvisioningData,
		},
		validate: {
			body: joi.object().keys({
				cardId:         joi.string().guid().required(),
				walletType:     joi.string().required(),
				nonce:          joi.string(),
				nonceSignature: joi.string(),
				certificates:   joi.array().items(joi.string()),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					activationData:     joi.string(),
					fundingAccountInfo: joi.string(),
					encryptedPassData:  joi.string(),
					ephemeralPublicKey: joi.string(),
				}),
			}),
		},
	})
	public async prepareProvisioningData (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.prepareProvisioningData({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.body.cardId,
			walletType:     req.body.walletType,
			nonce:          req.body.nonce,
			nonceSignature: req.body.nonceSignature,
			certificates:   req.body.certificates,
		});

		return {
			activationData:     result.activationData,
			fundingAccountInfo: result.fundingAccountInfo,
			encryptedPassData:  result.encryptedPassData,
			ephemeralPublicKey: result.ephemeralPublicKey,
		};
	}

	@handler({
		description: 'Get card reissue cost',
		method:      'GET',
		path:        '/cards/:cardId/reissue/cost',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.getCardReissueCost,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
			query: {
				newCardType: joi.string(), // ['DEBIT_CARD', 'VIRTUAL_DEBIT_CARD']
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardReissueCost: joi.number().allow(null).required(),
				}),
			}),
		},
	})
	public async getCardReissueCost (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.getCardReissueCost({
			cardId:         req.params.cardId,
			counterpartyId: req.auth.counterpartyId!,
			newCardType:    req.query?.newCardType || 'DEBIT_CARD', // query.newCardType не обязательный для исп. до версии 1.41
		});

		return {
			cardReissueCost: result.cardReissueCost,
		};
	}

	@handler({
		description: 'Get card refill invoice link',
		method:      'GET',
		path:        '/cards/:cardId/invoices/links',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.CARD,
			action:   AuditAction.getCardRefillInvoiceLink,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					link: joi.string().required(),
				}),
			}),
		},
	})
	public async getCardRefillInvoiceLink (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.getCardRefillInvoiceLink({
			cardId:         req.params.cardId,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			link: result.link,
		};
	}
}
