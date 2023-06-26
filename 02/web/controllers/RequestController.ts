import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {RequestServiceClient} from 'rpc/lib/RequestServiceClient';
import {AppServiceClient} from 'rpc/lib/AppServiceClient';


export class RequestController {

	constructor (
		private requestServiceClient: RequestServiceClient,
		private appServiceClient: AppServiceClient,
	) {}

	@handler({
		description: 'Set PIN for card',
		method:      'POST',
		path:        '/requests/cards/:cardId/pin',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.setPIN,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				pin: joi.string().regex(/^\d{4}$/).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					requestId:   joi.string().guid().required(),
					requestType: joi.string().valid('SYNC', 'ASYNC').required(),
				}),
			}),
		},
	})
	public async setPinForCard (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createSetPinRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				requestToken:   req.auth.requestToken!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			cardId: req.params.cardId,
			pin:    req.body.pin,
		});

		return {
			requestId:   result.requestId,
			requestType: result.requestType,
		};
	}

	@handler({
		description: 'Temporary block card',
		method:      'POST',
		path:        '/requests/cards/:cardId/block',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.temporaryBlockCard,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					requestId:   joi.string().guid().required(),
					requestType: joi.string().valid('SYNC', 'ASYNC').required(),
				}),
			}),
		},
	})
	public async temporaryBlockCard (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createTemporaryBlockCardRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				requestToken:   req.auth.requestToken!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			cardId: req.params.cardId,
		});

		return {
			requestId:   result.requestId,
			requestType: result.requestType,
		};
	}

	@handler({
		description: 'Unblock temporary blocked card',
		method:      'POST',
		path:        '/requests/cards/:cardId/unblock',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.unblockCard,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					requestId:   joi.string().guid().required(),
					requestType: joi.string().valid('SYNC', 'ASYNC').required(),
				}),
			}),
		},
	})
	public async unblockCard (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createUnblockCardRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				requestToken:   req.auth.requestToken!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			cardId: req.params.cardId,
		});

		return {
			requestId:   result.requestId,
			requestType: result.requestType,
		};
	}

	@handler({
		description: 'Set card\'s internet limit',
		method:      'POST',
		path:        '/requests/cards/:cardId/internet-limit',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.setInternetLimit,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				amount: joi.number().integer().positive().allow(0).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					requestId:   joi.string().guid().required(),
					requestType: joi.string().valid('SYNC', 'ASYNC').required(),
				}),
			}),
		},
	})
	public async createUpdateInternetLimitRequest (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createUpdateInternetLimitRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				requestToken:   req.auth.requestToken!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			cardId: req.params.cardId,
			amount: req.body.amount,
		});

		return {
			requestId:   result.requestId,
			requestType: result.requestType,
		};
	}

	@handler({
		description: 'Create request for cashback withdrawal',
		method:      'POST',
		path:        '/requests/bonuses/cashback/withdrawals',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.withdrawalCashback,
		},
		validate: {
			body: joi.object().keys({
				amount: joi.number().integer().positive().required(),
				cardId: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					requestId:   joi.string().guid().required(),
					requestType: joi.string().valid('SYNC', 'ASYNC').required(),
				}),
			}),
		},
	})
	public async createCashbackWithdrawalRequest (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createCashbackWithdrawalRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				requestToken:   req.auth.requestToken!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			amount: req.body.amount,
			cardId: req.body.cardId,
		});

		return {
			requestId:   result.requestId,
			requestType: result.requestType,
		};
	}

	@handler({
		description: 'Show Request info by id',
		method:      'GET',
		path:        '/requests/:requestId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				requestId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:          joi.string().guid().required(),
					type:        joi.string().allow('SYNC', 'ASYNC').required(),
					method:      joi.string().required(),
					data:        joi.object().required(),
					status:      joi.string().required(),
					createdAt:   joi.date().required(),
					finalizedAt: joi.date().allow(null).required(),
				}),
			}),
		},
	})
	public async showRequest (req: RequestObj): Promise<object> {
		const result = await this.requestServiceClient.showRequest({
			counterpartyId: req.auth.counterpartyId!,
			requestId:      req.params.requestId,
		});

		return {
			id:          result.id,
			type:        result.type,
			method:      result.method,
			data:        result.data,
			status:      result.status,
			createdAt:   result.createdAt,
			finalizedAt: result.finalizedAt,
		};
	}

	@handler({
		description: 'Activate Card withPin',
		method:      'POST',
		path:        '/requests/cards/:cardId/activation',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.activateCardWithPIN,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				pin: joi.string().regex(/^\d*$/).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async activateCardWithPin (req: RequestObj): Promise<{ requestId: string }> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createActivateCardWithPinRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				requestToken:   req.auth.requestToken!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			cardId: req.params.cardId,
			pin:    req.body.pin,
		});

		return {
			requestId: result.requestId,
		};
	}

	@handler({
		description: 'List all pending requests for card',
		method:      'GET',
		path:        '/requests/me/unfinished',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.getListOfCards,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.array().items(joi.object().keys({
					requestId: joi.string().guid().required(),
					method:    joi.string().required(),
				})),
			}),
		},
	})
	public async listPendingForCard (req: RequestObj): Promise<{ items: Array<{ requestId: string; method: string }>; total: number }> {
		const result = await this.requestServiceClient.listUnfinishedRequests({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					method:    item.method,
					requestId: item.requestId,
				};
			}),
		};
	}

	@handler({
		description: "Change user's phone number",
		method:      'POST',
		path:        '/requests/phone/change',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.REQUEST,
			action:   AuditAction.changeMobilePhone,
		},
		validate: {
			body: joi.object().keys({
				requestId: joi.string().guid().required(),
				phone:     joi.string().phone().required(),
				otpCode:   joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					requestId:       joi.string().guid().allow(null),
					requestType:     joi.string().valid('SYNC', 'ASYNC').allow(null),
					otpSuccess:      joi.boolean(),
					otpAttemptsLeft: joi.number().integer(),
				}),
			}),
		},
	})
	public async createChangePhoneNumberRequest (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createChangePhoneNumberRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
			},
			phone:     req.body.phone,
			requestId: req.body.requestId,
			otpCode:   req.body.otpCode,
			deviceId:  installation.deviceId,
		});

		return {
			requestId:       result.requestId,
			requestType:     result.requestType,
			otpSuccess:      result.otpSuccess,
			otpAttemptsLeft: result.otpAttemptsLeft,
		};
	}
}
