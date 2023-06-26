import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {BillingServiceClient} from 'rpc/lib/BillingServiceClient';
import {RequestServiceClient} from 'rpc/lib/RequestServiceClient';
import {AppServiceClient} from 'rpc/lib/AppServiceClient';

export class BillingController {

	constructor (
		private billingServiceClient: BillingServiceClient,
		private requestServiceClient: RequestServiceClient,
		private appServiceClient: AppServiceClient,
	) {}

	@handler({
		description: 'List billing categories',
		method:      'GET',
		path:        '/billing/categories',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.getListOfCategories,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							category:       joi.string().required(),
							parentCategory: joi.string().allow(null).required(),
							type:           joi.string().required(),
							status:         joi.string().required(),
							order:          joi.number().required(),
							title:          joi.string().allow(null).required(),
							description:    joi.string().allow(null).required(),
						}),
					),
				}),
			}),
		},
	})
	public async listCategories (req: RequestObj): Promise<any> {
		const result = await this.billingServiceClient.listCategories({
			counterpartyId: req.auth.counterpartyId!,
			filter:         {
				statuses: ['ACTIVE', 'IN_DEVELOPMENT'],
			},
			lg: req.auth.lg!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					category:       it.category,
					parentCategory: it.parentCategory,
					type:           it.type,
					status:         it.status,
					order:          it.order,
					title:          it.title,
					description:    it.description,
				};
			}),
		};
	}

	@handler({
		description: 'List billing services',
		method:      'GET',
		path:        '/billing/services',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.getListOfServices,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					category:     joi.string(),
					searchString: joi.string(),
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
							id:          joi.string().required(),
							name:        joi.string().required(),
							category:    joi.string().required(),
							status:      joi.string().required(),
							iconId:      joi.string().allow(null).required(),
							title:       joi.string().allow(null).required(),
							description: joi.string().allow(null).required(),
						}),
					),
				}),
			}),
		},
	})
	public async listServices (req: RequestObj): Promise<any> {
		const result = await this.billingServiceClient.listServicesForUser({
			filter: {
				category:     req.query.filter?.category,
				searchString: req.query.filter?.searchString,
			},
			limit:          req.query.limit,
			skip:           req.query.skip,
			lg:             req.auth.lg!,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:          it.id,
					name:        it.name,
					category:    it.category,
					status:      it.status,
					iconId:      it.iconId,
					title:       it.title,
					description: it.description,
				};
			}),
		};
	}

	@handler({
		description: 'Show service details',
		method:      'GET',
		path:        '/billing/services/:serviceId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.getService,
		},
		validate: {
			params: joi.object().keys({
				serviceId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:          joi.string().required(),
					name:        joi.string().required(),
					category:    joi.string().required(),
					status:      joi.string().required(),
					iconId:      joi.string().allow(null).required(),
					title:       joi.string().allow(null).required(),
					description: joi.string().allow(null).required(),
					steps:       joi.array().items(
						joi.object().keys({
							fields: joi.array().items(
								joi.object().keys({
									id:          joi.string().required(),
									step:        joi.string().required(),
									key:         joi.string().required(),
									format:      joi.string().allow(null).required(),
									validation:  joi.string().allow(null).required(),
									isRequired:  joi.boolean().required(),
									title:       joi.string().allow(null).required(),
									description: joi.string().allow(null).required(),
									regular:     joi.object().keys({
										rawRegular:    joi.string().required(),
										multiLine:     joi.boolean().required(),
										caseSensitive: joi.boolean().required(),
									}).allow(null),
								}),
							),
						}),
					),
				}),
			}),
		},
	})
	public async showService (req: RequestObj): Promise<object> {
		const service = await this.billingServiceClient.showService({
			serviceId: req.params.serviceId,
			lg:        req.auth.lg!,
		});

		return {
			id:          service.id,
			name:        service.name,
			category:    service.category,
			status:      service.status,
			iconId:      service.iconId,
			title:       service.title,
			description: service.description,
			steps:       service.steps.map((step) => {
				return {
					fields: step.fields.map((field) => {
						return {
							id:          field.id,
							step:        field.step,
							key:         field.key,
							format:      field.format,
							validation:  field.validation,
							isRequired:  field.isRequired,
							title:       field.title,
							description: field.description,
							regular:     field.regular,
						};
					}),
				};
			}),
		};
	}

	@handler({
		description: 'Show service details, v2',
		method:      'GET',
		path:        '/billing/services/:serviceId/v2',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.getService,
		},
		validate: {
			params: joi.object().keys({
				serviceId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:          joi.string().required(),
					name:        joi.string().required(),
					category:    joi.string().required(),
					status:      joi.string().required(),
					iconId:      joi.string().allow(null).required(),
					title:       joi.string().allow(null).required(),
					description: joi.string().allow(null).required(),
					steps:       joi.array().items(
						joi.object().keys({
							step:   joi.string().required(),
							fields: joi.array().items(joi.object()),
						}),
					),
				}),
			}),
		},
	})
	public async showServiceV2 (req: RequestObj): Promise<object> {
		const service = await this.billingServiceClient.showServiceV2({
			serviceId: req.params.serviceId,
			lg:        req.auth.lg!,
		});

		return {
			id:          service.id,
			name:        service.name,
			category:    service.category,
			status:      service.status,
			iconId:      service.iconId,
			title:       service.title,
			description: service.description,
			steps:       service.steps.map((step) => {
				return {
					step:   step.step,
					fields: step.fields,
				};
			}),
		};
	}

	@handler({
		description: 'Show commission and limits for refilling mobile phone',
		method:      'GET',
		path:        '/billing/mobile-refill/commission',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.getCommission,
		},
		validate: {
			query: joi.object().keys({
				phone: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					iconId:            joi.string().required(),
					commissionFormula: joi.object().keys({
						fixed:    joi.number(),
						percents: joi.number(),
						min:      joi.number().allow(null),
						max:      joi.number().allow(null),
					}),
					availableDayQuantity:   joi.number().allow(null),
					availableMonthQuantity: joi.number().allow(null),
					minTransactionAmount:   joi.number().allow(null),
					maxTransactionAmount:   joi.number().allow(null),
					availableDayAmount:     joi.number().allow(null),
					availableMonthAmount:   joi.number().allow(null),
				}),
			}),
		},
	})
	public async getBillingPaymentPreparationInfoByPhone (req: RequestObj): Promise<any> {
		const result = await this.billingServiceClient.getBillingPaymentPreparationInfoByPhone({
			phone:          req.query.phone,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			iconId:            result.iconId,
			commissionFormula: {
				fixed:    result.commissionFormula.fixed,
				percents: result.commissionFormula.percents,
				min:      result.commissionFormula.min,
				max:      result.commissionFormula.max,
			},
			availableDayQuantity:   result.availableDayQuantity,
			availableMonthQuantity: result.availableMonthQuantity,
			minTransactionAmount:   result.minTransactionAmount,
			maxTransactionAmount:   result.maxTransactionAmount,
			availableDayAmount:     result.availableDayAmount,
			availableMonthAmount:   result.availableMonthAmount,
		};
	}

	@handler({
		description: 'Create mobile refill bill and payment (incl. validation on provider)',
		method:      'POST',
		path:        '/billing/mobile-refill/pay',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.createBill,
		},
		validate: {
			body: joi.object().keys({
				phone:      joi.string().required(),
				amount:     joi.number().integer().positive().required(),
				cardFromId: joi.string().guid().required(),
				title:      joi.string().allow(null),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					paymentId: joi.string().required(),
					billId:    joi.string().required(),
				}),
			}),
		},
	})
	public async createMobileRefillBillingPayment (req: RequestObj): Promise<any> {
		const installation = await this.appServiceClient.showInstallation({
			installationId: req.auth.installationId!,
		});

		const result = await this.requestServiceClient.createMobileRefillBillingPaymentRequest({
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
			phone:      req.body.phone,
			amount:     req.body.amount,
			cardFromId: req.body.cardFromId,
			title:      req.body.title || null,
		});

		return {
			paymentId: result.paymentId,
			billId:    result.billId,
		};
	}

	@handler({
		description: 'Show commission and limits for other billing payments',
		method:      'GET',
		path:        '/billing/commission',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.getCommission,
		},
		validate: {
			query: joi.object().keys({
				serviceId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					commissionFormula: joi.object().keys({
						fixed:    joi.number(),
						percents: joi.number(),
						min:      joi.number().allow(null),
						max:      joi.number().allow(null),
					}),
					availableDayQuantity:   joi.number().allow(null),
					availableMonthQuantity: joi.number().allow(null),
					minTransactionAmount:   joi.number().allow(null),
					maxTransactionAmount:   joi.number().allow(null),
					availableDayAmount:     joi.number().allow(null),
					availableMonthAmount:   joi.number().allow(null),
				}),
			}),
		},
	})
	public async getBillingPaymentPreparationInfo (req: RequestObj): Promise<any> {
		const result = await this.billingServiceClient.getBillingPaymentPreparationInfo({
			serviceId:      req.query.serviceId,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			commissionFormula: {
				fixed:    result.commissionFormula.fixed,
				percents: result.commissionFormula.percents,
				min:      result.commissionFormula.min,
				max:      result.commissionFormula.max,
			},
			availableDayQuantity:   result.availableDayQuantity,
			availableMonthQuantity: result.availableMonthQuantity,
			minTransactionAmount:   result.minTransactionAmount,
			maxTransactionAmount:   result.maxTransactionAmount,
			availableDayAmount:     result.availableDayAmount,
			availableMonthAmount:   result.availableMonthAmount,
		};
	}

	@handler({
		description: 'Create and validate bill',
		method:      'POST',
		path:        '/billing/bills',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BILLING,
			action:   AuditAction.createBill,
		},
		validate: {
			body: joi.object().keys({
				serviceId: joi.string().required(),
				fields:    joi.array().items(
					joi.object().keys({
						id:    joi.string(),
						key:   joi.string().required(),
						value: joi.any().required(),
					}),
				),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					billId:             joi.string().required(),
					message:            joi.string().allow(null),
					billAmount:         joi.number().allow(null),
					isAmountChangeable: joi.boolean().allow(null),
					status:             joi.string().required(),
					additionalInfo:     joi.array().items(
						joi.object().keys({
							name:  joi.string(),
							value: joi.string(),
						}),
					),
				}),
			}),
		},
	})
	public async createBill (req: RequestObj): Promise<object> {
		const result = await this.billingServiceClient.createBill({
			serviceId:      req.body.serviceId,
			counterpartyId: req.auth.counterpartyId!,
			fields:         req.body.fields,
		});

		return {
			billId:             result.billId,
			message:            result.message,
			billAmount:         result.billAmount,
			isAmountChangeable: result.isAmountChangeable,
			status:             result.status,
			additionalInfo:     result.additionalInfo ?? [],
		};
	}
}
