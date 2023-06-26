import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';
import {PaymentServiceClient} from 'rpc/lib/PaymentServiceClient';
import {RequestServiceClient} from 'rpc/lib/RequestServiceClient';
import {AppServiceClient} from 'rpc/lib/AppServiceClient';


export class PaymentController {

	constructor (
		private paymentServiceClient: PaymentServiceClient,
		private requestServiceClient: RequestServiceClient,
		private appServiceClient: AppServiceClient,
	) {}

	@handler({
		description: 'Create direct transfer',
		method:      'POST',
		path:        '/payments/transfer',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				from: joi.object().keys({
					cardId: joi.string().guid().required(),
					cvv:    joi.string().length(3),
				}).required(),
				to: joi.object().keys({
					cardId:             joi.string().guid(),
					contactId:          joi.string().guid(),
					phoneBookContactId: joi.string().guid(),
					replyToOperationId: joi.string().guid(),
				}).xor('cardId', 'phoneBookContactId', 'replyToOperationId').required(),
				amount:          joi.number().integer().positive().required(),
				currency:        joi.string().trim().required(),
				addCardToWallet: joi.boolean().default(false),
				comment:         joi.string().max(255).allow('').allow(null),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createDirectTransfer (req: RequestObj): Promise<object> {

		let to;

		if (req.body.to.cardId) {
			to = {
				cardId:    req.body.to.cardId,
				contactId: req.body.to.contactId,
			};
		} else if (req.body.to.phoneBookContactId) {
			to = {
				phoneBookContactId: req.body.to.phoneBookContactId,
			};
		} else {
			to = {
				replyToOperationId: req.body.to.replyToOperationId,
			};
		}
		const payment = await this.paymentServiceClient.createDirectTransfer({
			counterpartyId: req.auth.counterpartyId!,
			from:           {
				cardId: req.body.from.cardId,
				cvv:    req.body.from.cvv,
			},
			to:              to,
			amount:          req.body.amount,
			currency:        req.body.currency,
			addCardToWallet: req.body.addCardToWallet,
			comment:         req.body.comment,
		});

		return {
			paymentId: payment.paymentId,
		};
	}

	@handler({
		description: 'Create SEP payment',
		method:      'POST',
		path:        '/payments/sep',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				from: joi.object().keys({
					cardId: joi.string().guid().required(),
				}).required(),
				to: joi.object().keys({
					recipient: joi.string().required(),
					taxId:     joi.string().required(),
					iban:      joi.string().required(),
					purpose:   joi.string().required(),
				}).required(),
				amount:           joi.number().integer().positive().required(),
				commissionAmount: joi.number().integer().positive().allow(0).required(),
				currency:         joi.string().trim().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createSepPayment (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const payment = await this.requestServiceClient.createSepPaymentRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
				requestToken:   req.auth.requestToken!,
			},
			from: {
				cardId: req.body.from.cardId,
			},
			to: {
				recipient: req.body.to.recipient,
				taxId:     req.body.to.taxId,
				iban:      req.body.to.iban,
				purpose:   req.body.to.purpose,
			},
			amount:           req.body.amount,
			commissionAmount: req.body.commissionAmount,
			currency:         req.body.currency,
		});

		return {
			paymentId: payment.paymentId,
		};
	}

	@handler({
		description: 'Get payment status and information',
		method:      'GET',
		path:        '/payments/:paymentId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getPayment,
		},
		cacheHeaders: {
			eTag: true,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:                 joi.string().guid().required(),
					type:               joi.string().required(),
					amount:             joi.number().positive().required(),
					totalAmount:        joi.number().positive().required(),
					currency:           joi.string().required(),
					commission:         joi.number().positive(),
					status:             joi.string().required(),
					cardId:             joi.string().guid(),
					cardFromId:         joi.string().guid(),
					cardToId:           joi.string().guid(),
					contactId:          joi.string().guid().allow(null),
					phoneBookContactId: joi.string().guid().allow(null),
					phone:              joi.string(),
					fullName:           joi.string(),
					paymentData:        joi.object().allow(null),
					confirmationData:   joi.object(),
					panMasked:          joi.string(),
					panToMasked:        joi.string(),
					allowedActions:     joi.array().items(joi.string()).required(),
					title:              joi.string(),
					description:        joi.string(),
					category:      	    joi.string().required(),
					categoryTitle:      joi.string(),
					isReturnType:       joi.boolean().required(),
					errorText:          joi.string(),
					createdAt:          joi.date().required(),
					receiptUrl:         joi.string().allow(null),
					avatarUrl:          joi.string().allow(null),
					comment:            joi.string().allow(null).required(),
					iconId:             joi.string().allow(null),
				}),
			}),
		},
	})
	public async showPayment (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.showPayment({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
			lg:             req.auth.lg!,
		});

		return {
			id:                 result.id,
			type:               result.type,
			amount:             result.amount,
			totalAmount:        result.totalAmount,
			currency:           result.currency,
			commission:         result.commission,
			status:             result.status,
			cardId:             result.cardFromId, // MB-6260
			cardFromId:         result.cardFromId,
			cardToId:           result.cardToId,
			contactId:          result.contactId,
			phoneBookContactId: result.phoneBookContactId,
			phone:              result.phone,
			fullName:           result.fullName,
			paymentData:        result.paymentData,
			confirmationData:   result.confirmationData,
			panMasked:          result.panMasked,
			panToMasked:        result.panToMasked,
			title:              result.title,
			description:        result.description,
			category:           result.category,
			categoryTitle:      result.categoryTitle,
			allowedActions:     result.allowedActions,
			isReturnType:       result.isReturnType,
			errorText:          result.errorText,
			createdAt:          result.createdAt,
			receiptUrl:         result.receiptUrl,
			avatarUrl:          result.avatarUrl,
			comment:            result.comment,
			iconId:             result.iconId,
		};
	}

	@handler({
		description: 'Get payment commission',
		method:      'GET',
		path:        '/payments/transfer/commission',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getCommission,
		},
		validate: {
			query: joi.object().keys({
				cardFromId:         joi.string().guid().required(),
				cardToId:           joi.string().guid(),
				phoneBookContactId: joi.string().guid(),
				amount:             joi.number().integer().positive().required(),
			}).xor('cardToId', 'phoneBookContactId'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					commission:         joi.number().positive().required(),
					commissionFormulas: joi.array().items(joi.object().keys({
						fixed:                  joi.number(),
						percents:               joi.number(),
						minCommission:          joi.number(),
						maxCommission:          joi.number(),
						amountLessEquals:       joi.number(),
						paymentSystemSurcharge: {
							mastercard: {
								percents: joi.number(),
								fixed:    joi.number(),
							},
							visa: {
								percents: joi.number(),
								fixed:    joi.number(),
							},
						},
					})),
				}),
			}),
		},
	})
	public async showCommission (req: RequestObj): Promise<object> {
		const cardTo = req.query.cardToId ? {
			cardToId: req.query.cardToId,
		} : {
			phoneBookContactId: req.query.phoneBookContactId,
		};

		const result = await this.paymentServiceClient.showCommission({
			counterpartyId: req.auth.counterpartyId!,
			cardFromId:     req.query.cardFromId,
			cardTo:         cardTo,
			amount:         req.query.amount,
		});

		return {
			commission:         result.commission,
			commissionFormulas: result.commissionFormulas.map((item) => {
				return {
					percents:               item.percents,
					fixed:                  item.fixed,
					minCommission:          item.minCommission,
					maxCommission:          item.maxCommission,
					amountLessEquals:       item.amountLessEquals,
					paymentSystemSurcharge: {
						mastercard: {
							percents: item.paymentSystemSurcharge.mastercard.percents,
							fixed:    item.paymentSystemSurcharge.mastercard.fixed,
						},
						visa: {
							percents: item.paymentSystemSurcharge.visa.percents,
							fixed:    item.paymentSystemSurcharge.visa.percents,
						},
					},
				};
			}),
		};
	}

	@handler({
		description: 'Get SEP payment commission',
		method:      'GET',
		path:        '/payments/sep/commission',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getCommission,
		},
		validate: {
			query: {
				cardId:   joi.string().guid().required(),
				amount:   joi.number().integer().positive().required(),
				iban:     joi.string().required(),
				currency: joi.string().trim().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					commissionAmount: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async showSepPaymentCommission (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.showSepPaymentCommission({
			counterpartyId: req.auth.counterpartyId!,
			from:           {
				cardId: req.query.cardId,
			},
			to: {
				iban: req.query.iban,
			},
			amount:   req.query.amount,
			currency: req.query.currency,
		});

		return {
			commissionAmount: result.commissionAmount,
		};
	}

	@handler({
		description: 'Confirm payment',
		method:      'POST',
		path:        '/payments/transfer/confirm',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.confirm,
		},
		validate: {
			body: joi.object().keys({
				paymentId: joi.string().guid(),
				PaRes:     joi.string(),
				MD:        joi.string(),
				code:      joi.string(),
			}).options({ allowUnknown: true, stripUnknown: true }),
			query: {
				paymentId: joi.string().guid(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().guid(),
				}),
			}),
		},
	})
	public async confirmPayment (req: RequestObj): Promise<object> {
		const payment = await this.paymentServiceClient.confirmPayment({
			paymentId: req.query.paymentId || req.body.paymentId,
			paRes:     req.body.PaRes,
			MD:        req.body.MD,
			code:      req.body.code,
		});

		return {
			paymentId: payment.paymentId,
		};
	}

	@handler({
		description: 'Get info whether payment auth required',
		method:      'GET',
		path:        '/payments/transfer/info',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getAuthInfo,
		},
		validate: {
			query: joi.object().keys({
				cardFromId:         joi.string().guid().required(),
				cardToId:           joi.string().guid(),
				amount:             joi.number().integer().positive(),
				phoneBookContactId: joi.string().guid(),
			}).xor('cardToId', 'phoneBookContactId'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					isPaymentAuthRequired: joi.boolean().required(),
					commissionFormulas:    joi.array().required().items({
						percents:               joi.number().allow(null),
						fixed:                  joi.number().allow(null),
						minCommission:          joi.number().allow(null),
						maxCommission:          joi.number().allow(null),
						amountLessEquals:       joi.number().allow(null),
						paymentSystemSurcharge: joi.object().keys({
							mastercard: {
								percents: joi.number().allow(null),
								fixed:    joi.number().allow(null),
							},
							visa: {
								percents: joi.number().allow(null),
								fixed:    joi.number().allow(null),
							},
						}),
					}),
					minAllowedAmount: joi.number().required(),
					maxAllowedAmount: joi.number().required(),
				}),
			}),
		},
	})
	public async getPaymentPreparationInfo (req: RequestObj): Promise<object> {

		const cardTo = req.query.cardToId ? {
			cardToId: req.query.cardToId,
		} : {
			phoneBookContactId: req.query.phoneBookContactId,
		};

		const result = await this.paymentServiceClient.getPaymentPreparationInfo({
			counterpartyId: req.auth.counterpartyId!,
			cardFromId:     req.query.cardFromId,
			cardTo:         cardTo,
			amount:         req.query.amount,
		});

		return {
			isPaymentAuthRequired: result.isPaymentAuthRequired,
			commissionFormulas:    result.commissionFormulas,
			minAllowedAmount:      result.minAllowedAmount,
			maxAllowedAmount:      result.maxAllowedAmount,
		};
	}

	@handler({
		description: 'Get info about sep limits',
		method:      'GET',
		path:        '/payments/sep/info',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getSepComissionAndLimitsInfo,
		},
		validate: {
			query: {
				cardId:   joi.string().guid().required(),
				amount:   joi.number().integer().positive().required(),
				iban:     joi.string().required(),
				currency: joi.string().trim().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					commissionAmount:     joi.number().required(),
					transactionLimit:     joi.number().required(),
					monthLimit:           joi.number().required(),
					availableMonthAmount: joi.number().required(),
				}),
			}),
		},
	})
	public async getSepPaymentPreparationInfo (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.showSepPaymentCommissionAndLimits({
			counterpartyId: req.auth.counterpartyId!,
			from:           {
				cardId: req.query.cardId,
			},
			to: {
				iban: req.query.iban,
			},
			amount:   req.query.amount,
			currency: req.query.currency,
		});

		return {
			commissionAmount:     result.commissionAmount,
			transactionLimit:     result.transactionLimit,
			monthLimit:           result.monthLimit,
			availableMonthAmount: result.availableMonthAmount,
		};
	}

	@handler({
		description: 'Resend payment lookup code',
		method:      'POST',
		path:        '/payments/:paymentId/resend',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.resendLookup,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					required: joi.boolean().required(),
				}),
			}),
		},
	})
	public async resendLookupCode (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.resendLookupCode({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
		});

		return {
			paymentId: result.paymentId,
		};
	}


	/* Auth level: User */
	@handler({
		description: 'Create direct transfer (for auth: User)',
		method:      'POST',
		path:        '/payments/user/transfer',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				from: joi.object().keys({
					cardId: joi.string().guid().required(),
					cvv:    joi.string().length(3),
				}).required(),
				to: joi.object().keys({
					cardId:             joi.string().guid(),
					contactId:          joi.string().guid(),
					phoneBookContactId: joi.string().guid(),
				}).xor('cardId', 'phoneBookContactId').required(),
				amount:          joi.number().integer().positive().required(),
				currency:        joi.string().trim().required(),
				addCardToWallet: joi.boolean().default(false),
				comment:         joi.string().max(255).allow('').allow(null),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createDirectTransferForUser (req: RequestObj): Promise<object> {
		const payment = await this.paymentServiceClient.createDirectTransfer({
			counterpartyId: req.auth.counterpartyId!,
			from:           {
				cardId: req.body.from.cardId,
				cvv:    req.body.from.cvv,
			},
			to: req.body.to.cardId ? {
				cardId:    req.body.to.cardId,
				contactId: req.body.to.contactId,
			} : {
				phoneBookContactId: req.body.to.phoneBookContactId,
			},
			amount:          req.body.amount,
			currency:        req.body.currency,
			addCardToWallet: req.body.addCardToWallet,
			comment:         req.body.comment,
		});

		return {
			paymentId: payment.paymentId,
		};
	}

	@handler({
		description: 'Get payment status and information (for auth: User)',
		method:      'GET',
		path:        '/payments/user/:paymentId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getStatus,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:               joi.string().guid().required(),
					type:             joi.string().required(),
					amount:           joi.number().positive().required(),
					totalAmount:      joi.number().positive().required(),
					currency:         joi.string().required(),
					commission:       joi.number().positive(),
					status:           joi.string().required(),
					cardId:           joi.string().guid(),
					cardFromId:       joi.string().guid(),
					cardToId:         joi.string().guid(),
					contactId:        joi.string().guid(),
					phone:            joi.string(),
					fullName:         joi.string(),
					confirmationData: joi.object(),
					panMasked:        joi.string(),
					panToMasked:      joi.string(),
					allowedActions:   joi.array().items(joi.string()).required(),
					title:            joi.string(),
					description:      joi.string(),
					category:      	  joi.string().required(),
					categoryTitle:    joi.string(),
					isReturnType:     joi.boolean().required(),
					errorText:        joi.string(),
					createdAt:        joi.date().required(),
					receiptUrl:       joi.string().allow(null).required(),
					comment:          joi.string().allow(null).required(),
				}),
			}),
		},
	})
	public async showPaymentForUser (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.showPayment({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
			lg:             req.auth.lg!,
		});

		return {
			id:               result.id,
			type:             result.type,
			amount:           result.amount,
			totalAmount:      result.totalAmount,
			currency:         result.currency,
			cardId:           result.cardFromId, // MB-6260
			cardFromId:       result.cardFromId,
			cardToId:         result.cardToId,
			contactId:        result.contactId,
			phone:            result.phone,
			fullName:         result.fullName,
			confirmationData: result.confirmationData,
			panMasked:        result.panMasked,
			panToMasked:      result.panToMasked,
			allowedActions:   result.allowedActions,
			title:            result.title,
			description:      result.description,
			category:         result.category,
			categoryTitle:    result.categoryTitle,
			createdAt:        result.createdAt,
			status:           result.status,
			isReturnType:     result.isReturnType,
			errorText:        result.errorText,
			commission:       result.commission,
			receiptUrl:       result.receiptUrl,
			comment:          result.comment,
		};
	}

	@handler({
		description: 'Get payment commission  (for auth: User)',
		method:      'GET',
		path:        '/payments/user/transfer/commission',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getCommission,
		},
		validate: {
			query: joi.object().keys({
				cardFromId:         joi.string().guid().required(),
				cardToId:           joi.string().guid(),
				phoneBookContactId: joi.string().guid(),
				amount:             joi.number().integer().positive().required(),
			}).xor('cardToId', 'phoneBookContactId'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					commission:         joi.number().positive().required(),
					commissionFormulas: joi.array().items(joi.object().keys({
						fixed:                  joi.number(),
						percents:               joi.number(),
						minCommission:          joi.number(),
						maxCommission:          joi.number(),
						amountLessEquals:       joi.number(),
						paymentSystemSurcharge: {
							mastercard: {
								percents: joi.number(),
								fixed:    joi.number(),
							},
							visa: {
								percents: joi.number(),
								fixed:    joi.number(),
							},
						},
					})),
				}),
			}),
		},
	})
	public async showCommissionForUser (req: RequestObj): Promise<object> {
		const cardTo = req.query.cardToId ? {
			cardToId: req.query.cardToId,
		} : {
			phoneBookContactId: req.query.phoneBookContactId,
		};

		const result = await this.paymentServiceClient.showCommission({
			counterpartyId: req.auth.counterpartyId!,
			cardFromId:     req.query.cardFromId,
			cardTo:         cardTo,
			amount:         req.query.amount,
		});

		return {
			commission:         result.commission,
			commissionFormulas: result.commissionFormulas.map((item) => {
				return {
					percents:               item.percents,
					fixed:                  item.fixed,
					minCommission:          item.minCommission,
					maxCommission:          item.maxCommission,
					amountLessEquals:       item.amountLessEquals,
					paymentSystemSurcharge: {
						mastercard: {
							percents: item.paymentSystemSurcharge.mastercard.percents,
							fixed:    item.paymentSystemSurcharge.mastercard.fixed,
						},
						visa: {
							percents: item.paymentSystemSurcharge.visa.percents,
							fixed:    item.paymentSystemSurcharge.visa.percents,
						},
					},
				};
			}),
		};
	}

	@handler({
		description: 'Get info whether payment auth required',
		method:      'GET',
		path:        '/payments/user/transfer/info',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.getAuthInfo,
		},
		validate: {
			query: joi.object().keys({
				cardFromId:         joi.string().guid().required(),
				cardToId:           joi.string().guid(),
				amount:             joi.number().integer().positive(),
				phoneBookContactId: joi.string().guid(),
			}).xor('cardToId', 'phoneBookContactId'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					isPaymentAuthRequired: joi.boolean().required(),
					commissionFormulas:    joi.array().required().items({
						percents:               joi.number().allow(null),
						fixed:                  joi.number().allow(null),
						minCommission:          joi.number().allow(null),
						maxCommission:          joi.number().allow(null),
						amountLessEquals:       joi.number().allow(null),
						paymentSystemSurcharge: joi.object().keys({
							mastercard: {
								percents: joi.number().allow(null),
								fixed:    joi.number().allow(null),
							},
							visa: {
								percents: joi.number().allow(null),
								fixed:    joi.number().allow(null),
							},
						}),
					}),
					minAllowedAmount: joi.number().required(),
					maxAllowedAmount: joi.number().required(),
				}),
			}),
		},
	})
	public async getPaymentPreparationInfoForUser (req: RequestObj): Promise<object> {
		const cardTo = req.query.cardToId ? {
			cardToId: req.query.cardToId,
		} : {
			phoneBookContactId: req.query.phoneBookContactId,
		};

		const result = await this.paymentServiceClient.getPaymentPreparationInfo({
			counterpartyId: req.auth.counterpartyId!,
			cardFromId:     req.query.cardFromId,
			cardTo:         cardTo,
			amount:         req.query.amount,
		});

		return {
			isPaymentAuthRequired: result.isPaymentAuthRequired,
			commissionFormulas:    result.commissionFormulas,
			minAllowedAmount:      result.minAllowedAmount,
			maxAllowedAmount:      result.maxAllowedAmount,
		};
	}

	@handler({
		description: 'Resend payment lookup code (for auth: User)',
		method:      'POST',
		path:        '/payments/user/:paymentId/resend',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.resendLookup,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					required: joi.boolean().required(),
				}),
			}),
		},
	})
	public async resendLookupCodeForUser (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.resendLookupCode({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
		});

		return {
			paymentId: result.paymentId,
		};
	}

	/**
	 * @deprecated ?
	 */
	@handler({
		description: 'Send payment receipt',
		method:      'POST',
		path:        '/payments/:paymentId/receipt-notices',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.sendReceipt,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
			body: joi.object().keys({
				email: joi.string().trim().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async sendPaymentReceipt (req: RequestObj): Promise<object> {
		await this.paymentServiceClient.sendPaymentReceipt({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
			email:          req.body.email,
		});

		return {
			paymentId: req.params.paymentId,
		};
	}

	/**
	 * @deprecated ?
	 */
	@handler({
		description: 'Send payment receipt',
		method:      'POST',
		path:        '/payments/user/:paymentId/receipt-notices',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.sendReceipt,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
			body: joi.object().keys({
				email: joi.string().trim().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async sendPaymentReceiptForUser (req: RequestObj): Promise<object> {
		await this.paymentServiceClient.sendPaymentReceipt({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
			email:          req.body.email,
		});

		return {
			paymentId: req.params.paymentId,
		};
	}

	@handler({
		description: 'Cancel payment',
		method:      'POST',
		path:        '/payments/:paymentId/cancel',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.cancel,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().required(),
				}),
			}),
		},
	})
	public async cancelId (req: RequestObj): Promise<object> {
		await this.paymentServiceClient.cancelPayment({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
		});

		return {
			paymentId: req.body.paymentId,
		};
	}

	@handler({
		description: 'Cancel payment (for auth: User)',
		method:      'POST',
		path:        '/payments/user/:paymentId/cancel',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.cancel,
		},
		validate: {
			params: {
				paymentId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					required: joi.boolean().required(),
				}),
			}),
		},
	})
	public async cancelPaymentForUser (req: RequestObj): Promise<object> {
		const result = await this.paymentServiceClient.cancelPayment({
			counterpartyId: req.auth.counterpartyId!,
			paymentId:      req.params.paymentId,
		});

		return {
			paymentId: result.paymentId,
		};
	}

	@handler({
		description: 'Create billing payment',
		method:      'POST',
		path:        '/payments/billing',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PAYMENT,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				billId:     joi.string().guid().required(),
				cardFromId: joi.string().guid().required(),
				fields:     joi.array().items(
					joi.object().keys({
						id:    joi.string(),
						key:   joi.string().required(),
						value: joi.any().required(),
					}),
				),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().required(),
				}),
			}),
		},
	})
	public async createBillingPayment (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createBillingPaymentRequest({
			counterpartyId: req.auth.counterpartyId!,
			authData:       {
				userId:         req.auth.userId!,
				sessionId:      req.auth.sessionId!,
				phone:          req.auth.phone!,
				ip:             req.ip,
				installationId: req.auth.installationId!,
				deviceInfo:     installation.deviceInfo || {},
				requestToken:   req.auth.requestToken!,
			},
			billId:     req.body.billId,
			cardFromId: req.body.cardFromId,
			fields:     req.body.fields,
		});

		return {
			paymentId: result.paymentId,
		};
	}
}
