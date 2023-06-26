import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {OperationServiceClient} from 'rpc/lib/OperationServiceClient';
import util from 'util';
import {Config} from '../../../Config';


export class OperationController {

	constructor (
		private operationServiceClient: OperationServiceClient,
		private config: Config,
	) {}

	@handler({
		description: 'Get list operation categories',
		method:      'GET',
		path:        '/operations/categories',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getList,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					categories: joi.array().items({
						category:      joi.string(),
						categoryTitle: joi.string(),
					}),
				}),
			}),
		},
	})
	public async listOperationCategories (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.listOperationCategories({
			lg:                req.auth.lg!,
			mccCategoriesOnly: true,
		});

		return {
			categories: result.categories.map((item) => {
				return {
					category:      item.category,
					categoryTitle: item.title,
				};
			}),
		};
	}

	@handler({
		description: 'Show operation',
		method:      'GET',
		path:        '/operations/:operationId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getOperation,
		},
		cacheHeaders: {
			eTag: true,
		},
		validate: {
			params: joi.object().keys({
				operationId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:                     joi.string().guid().required(),
					cardId:                 joi.string().required(),
					cardToId:               joi.string(),
					cardFromId:             joi.string().allow(null),
					status:                 joi.string().required(),
					amount:                 joi.string().required(),
					fee:                    joi.string().required(),
					totalAmount:            joi.string().required(),
					cashbackAmount:         joi.number().allow(null),
					currency:               joi.string().required(),
					paymentType:            joi.string().required(),
					contactId:              joi.string(),
					phoneBookContactId:     joi.string(),
					phoneBookContactFromId: joi.string(),
					phone:                  joi.string(),
					fullName:               joi.string(),
					panMasked:              joi.string(),
					panFromMasked:          joi.string(),
					panToMasked:            joi.string(),
					availableBalance:       joi.string(),
					allowedActions:         joi.array().items(joi.string()).required(),
					title:                  joi.string().required(),
					category:               joi.string().required(),
					categoryTitle:          joi.string().required(),
					date:                   joi.date().required(),
					errorText:              joi.string(),
					isReturnType:           joi.boolean().required(),
					terminalOwner:          joi.string().allow(null),
					terminalCategory:       joi.string().allow(null),
					transactionTotalAmount: joi.number().required(),
					transactionFee:         joi.number().required(),
					transactionCurrency:    joi.string().allow(null),
					exchangeRate:           joi.string().allow(null),
					purposeOfPayment:       joi.string().allow(null),
					taxId:                  joi.string().allow(null),
					iban:                   joi.string().allow(null),
					receiptUrl:             joi.string().allow(null),
					avatarUrl:              joi.string().allow(null),
					operationNumber:        joi.number().required(),
					comment:                joi.string().allow(null),
					ownComment:             joi.string().allow(null),
					ownCategory:            joi.string().allow(null),
					iconId:                 joi.string().allow(null),
					paymentData:            joi.object().allow(null),
					taxAmount:              joi.number().allow(null),
					taxes:                  joi.array().items(joi.object()).allow(null),
					terminalCode:           joi.string().allow(null),
					receivedAt:             joi.date().allow(null),
					acceptedForExecutionAt: joi.date().allow(null),
					refusedAt:              joi.date().allow(null),
					issuedCashAmount:       joi.number().allow(null),
				}),
			}),
		},
	})
	public async showOperation (req: RequestObj): Promise<object> {
		const operation = await this.operationServiceClient.showOperation({
			counterpartyId: req.auth.counterpartyId!,
			operationId:    req.params.operationId,
			lg:             req.auth.lg!,
		});

		return {
			id:                     operation.id,
			cardId:                 operation.actualCardId || operation.cardId,
			cardToId:               operation.cardToId,
			cardFromId:             operation.cardFromId,
			status:                 operation.status,
			amount:                 operation.amount,
			fee:                    operation.fee,
			totalAmount:            operation.totalAmount,
			currency:               operation.currency,
			contactId:              operation.contactId,
			phoneBookContactId:     operation.phoneBookContactId,
			phoneBookContactFromId: operation.phoneBookContactFromId,
			panMasked:              operation.panMasked,
			panFromMasked:          operation.panFromMasked,
			panToMasked:            operation.panToMasked,
			allowedActions:         operation.allowedActions,
			availableBalance:       operation.availableBalance,
			date:                   operation.date,
			transactionType:        operation.transactionType,
			paymentType:            operation.paymentType,
			cashbackAmount:         operation.cashbackAmount,
			title:                  operation.title,
			category:               operation.category,
			categoryTitle:          operation.categoryTitle,
			isReturnType:           operation.isReturnType,
			errorText:              operation.errorText,
			terminalOwner:          operation.terminalOwner,
			terminalCategory:       operation.terminalCategory,
			transactionTotalAmount: operation.transactionTotalAmount,
			transactionFee:         operation.transactionFee,
			transactionCurrency:    operation.transactionCurrency,
			exchangeRate:           operation.exchangeRate,
			purposeOfPayment:       operation.purposeOfPayment,
			taxId:                  operation.taxId,
			iban:                   operation.iban,
			receiptUrl:             operation.receiptUrl,
			avatarUrl:              operation.avatarUrl,
			operationNumber:        operation.operationNumber,
			comment:                operation.comment,
			ownComment:             operation.ownComment,
			ownCategory:            operation.ownCategory,
			iconId:                 operation.iconId,
			fullName:               operation.fullName,
			phone:                  operation.phone,
			paymentData:            operation.paymentData,
			taxAmount:              operation.taxAmount,
			taxes:                  operation.taxes,
			terminalCode:           operation.terminalCode,
			receivedAt:             operation.receivedAt,
			acceptedForExecutionAt: operation.acceptedForExecutionAt,
			refusedAt:              operation.refusedAt,
			issuedCashAmount:       operation.issuedCashAmount,
		};
	}

	/**
	 * @deprecated ?
	 */
	@handler({
		description: 'Send operation receipt',
		method:      'POST',
		path:        '/operations/:operationId/receipt-notices',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getReceipt,
		},
		validate: {
			params: {
				operationId: joi.string().guid().required(),
			},
			body: joi.object().keys({
				email: joi.string().trim().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					operationId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async sendOperationReceipt (req: RequestObj): Promise<object> {
		await this.operationServiceClient.sendOperationReceipt({
			counterpartyId: req.auth.counterpartyId!,
			operationId:    req.params.operationId,
			email:          req.body.email,
		});

		return {
			operationId: req.params.operationId,
		};
	}

	@handler({
		description: 'Get receipt.pdf by operation',
		method:      'GET',
		path:        '/operations/:operationId/receipt.pdf',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getReceipt,
		},
		options: {
			streamFile: true,
		},
		validate: {
			params: {
				operationId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.string().required(),
			}),
		},
	})
	public async getPdfReceipt (req: RequestObj): Promise<any> {
		const result = await this.operationServiceClient.showOperation({
			operationId:    req.params.operationId,
			counterpartyId: req.auth.counterpartyId!,
		});

		// Если удалось найти операцию для данного контрагента – стримим файл
		if (result) {
			const streamUrl = util.format(this.config.receiptPdfStreamUrl, req.params.operationId);

			return streamUrl;
		}
	}

	@handler({
		description: 'Approve operation over 3DS 2.0 by client',
		method:      'POST',
		path:        '/operations/3ds20/verifications/:verificationId/approval',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.approveOperation,
		},
		validate: {
			params: {
				verificationId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					success: joi.boolean().required(),
				}),
			}),
		},
	})
	public async approveVerification (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.approveVerification({
			verificationId: req.params.verificationId,
			sessionId:      req.auth.sessionId!,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			success: result.success,
		};
	}

	@handler({
		description: 'Reject operation over 3DS 2.0 by client',
		method:      'POST',
		path:        '/operations/3ds20/verifications/:verificationId/rejection',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.declineOperation,
		},
		validate: {
			params: {
				verificationId: joi.string().guid().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					success: joi.boolean().required(),
				}),
			}),
		},
	})
	public async rejectVerification (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.rejectVerification({
			verificationId: req.params.verificationId,
			sessionId:      req.auth.sessionId!,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			success: result.success,
		};
	}

	@handler({
		description: 'Get list of active 3DS 2.0 verifications by client',
		method:      'GET',
		path:        '/operations/3ds20/verifications',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getListOfVerifications,
		},
		validate: {
			query: {
				limit: joi.number().positive().allow(null),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							verificationId:          joi.string().required(),
							processingTransactionId: joi.string().required(),
							termName:                joi.string().allow(null),
							retailerName:            joi.string().allow(null),
							mcc:                     joi.string().allow(null),
							country:                 joi.string().allow(null),
							termOwner:               joi.string().allow(null),
							amount:                  joi.string().allow(null),
							currency:                joi.string().allow(null),
							terminalCategory:        joi.string().allow(null),
							mccCategory:             joi.string().allow(null),
							expiresAt:               joi.date().required(),
							cardId:                  joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listActiveVerifications (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.listActiveVerifications({
			counterpartyId: req.auth.counterpartyId!,
			limit:          req.query.limit,
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					verificationId:          item.verificationId,
					processingTransactionId: item.processingTransactionId,
					termName:                item.termName,
					retailerName:            item.retailerName,
					mcc:                     item.mcc,
					country:                 item.country,
					termOwner:               item.termOwner,
					amount:                  item.amount,
					currency:                item.currency,
					terminalCategory:        item.terminalCategory,
					mccCategory:             item.mccCategory,
					expiresAt:               item.expiresAt,
					cardId:                  item.cardId,
				};
			}),
		};
	}

	@handler({
		description: 'Set client merchant\'s name for operation',
		method:      'POST',
		path:        '/operations/:operationId/client-merchant-name',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.setMerchantName,
		},
		validate: {
			params: {
				operationId: joi.string().guid().required(),
			},
			body: {
				clientMerchantName: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					operationId: joi.string().required(),
				}),
			}),
		},
	})
	public async setClientMerchantNameForOperation (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.setClientMerchantNameForOperation({
			counterpartyId:     req.auth.counterpartyId!,
			operationId:        req.params.operationId,
			clientMerchantName: req.body.clientMerchantName,
		});

		return {
			operationId: result.operationId,
		};
	}

	/* USER */
	@handler({
		description: 'Show operation for user (INACTIVE counterparty)',
		method:      'GET',
		path:        '/operations/user/:operationId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getOperation,
		},
		cacheHeaders: {
			eTag: true,
		},
		validate: {
			params: joi.object().keys({
				operationId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:                     joi.string().guid().required(),
					cardId:                 joi.string().required(),
					cardToId:               joi.string(),
					cardFromId:             joi.string().allow(null),
					status:                 joi.string().required(),
					amount:                 joi.string().required(),
					fee:                    joi.string().required(),
					totalAmount:            joi.string().required(),
					cashbackAmount:         joi.number().allow(null),
					currency:               joi.string().required(),
					paymentType:            joi.string().required(),
					contactId:              joi.string(),
					phoneBookContactId:     joi.string(),
					phoneBookContactFromId: joi.string(),
					phone:                  joi.string(),
					fullName:               joi.string(),
					panMasked:              joi.string(),
					panFromMasked:          joi.string(),
					panToMasked:            joi.string(),
					availableBalance:       joi.string(),
					allowedActions:         joi.array().items(joi.string()).required(),
					title:                  joi.string().required(),
					category:               joi.string().required(),
					categoryTitle:          joi.string().required(),
					date:                   joi.date().required(),
					errorText:              joi.string(),
					isReturnType:           joi.boolean().required(),
					terminalOwner:          joi.string().allow(null),
					terminalCategory:       joi.string().allow(null),
					transactionTotalAmount: joi.number().required(),
					transactionFee:         joi.number().required(),
					transactionCurrency:    joi.string().allow(null),
					exchangeRate:           joi.string().allow(null),
					purposeOfPayment:       joi.string().allow(null),
					taxId:                  joi.string().allow(null),
					iban:                   joi.string().allow(null),
					receiptUrl:             joi.string().allow(null),
					avatarUrl:              joi.string().allow(null),
					operationNumber:        joi.number().required(),
					comment:                joi.string().allow(null),
					ownComment:             joi.string().allow(null),
					ownCategory:            joi.string().allow(null),
					iconId:                 joi.string().allow(null),
					paymentData:            joi.object().allow(null),
					taxAmount:              joi.number().allow(null),
					taxes:                  joi.array().items(joi.object()).allow(null),
					terminalCode:           joi.string().allow(null),
					receivedAt:             joi.date().allow(null),
					acceptedForExecutionAt: joi.date().allow(null),
					refusedAt:              joi.date().allow(null),
				}),
			}),
		},
	})
	public async showOperationForUser (req: RequestObj): Promise<object> {
		const operation = await this.operationServiceClient.showOperation({
			counterpartyId: req.auth.counterpartyId!,
			operationId:    req.params.operationId,
			lg:             req.auth.lg!,
		});

		return {
			id:                     operation.id,
			cardId:                 operation.cardId,
			cardToId:               operation.cardToId,
			cardFromId:             operation.cardFromId,
			status:                 operation.status,
			amount:                 operation.amount,
			fee:                    operation.fee,
			totalAmount:            operation.totalAmount,
			currency:               operation.currency,
			contactId:              operation.contactId,
			phoneBookContactId:     operation.phoneBookContactId,
			phoneBookContactFromId: operation.phoneBookContactFromId,
			panMasked:              operation.panMasked,
			panFromMasked:          operation.panFromMasked,
			panToMasked:            operation.panToMasked,
			allowedActions:         operation.allowedActions,
			availableBalance:       operation.availableBalance,
			date:                   operation.date,
			transactionType:        operation.transactionType,
			paymentType:            operation.paymentType,
			cashbackAmount:         operation.cashbackAmount,
			title:                  operation.title,
			category:               operation.category,
			categoryTitle:          operation.categoryTitle,
			isReturnType:           operation.isReturnType,
			errorText:              operation.errorText,
			terminalOwner:          operation.terminalOwner,
			terminalCategory:       operation.terminalCategory,
			transactionTotalAmount: operation.transactionTotalAmount,
			transactionFee:         operation.transactionFee,
			transactionCurrency:    operation.transactionCurrency,
			exchangeRate:           operation.exchangeRate,
			purposeOfPayment:       operation.purposeOfPayment,
			taxId:                  operation.taxId,
			iban:                   operation.iban,
			receiptUrl:             operation.receiptUrl,
			avatarUrl:              operation.avatarUrl,
			operationNumber:        operation.operationNumber,
			comment:                operation.comment,
			ownComment:             operation.ownComment,
			ownCategory:            operation.ownCategory,
			iconId:                 operation.iconId,
			fullName:               operation.fullName,
			phone:                  operation.phone,
			paymentData:            operation.paymentData,
			taxAmount:              operation.taxAmount,
			taxes:                  operation.taxes,
			terminalCode:           operation.terminalCode,
			receivedAt:             operation.receivedAt,
			acceptedForExecutionAt: operation.acceptedForExecutionAt,
			refusedAt:              operation.refusedAt,
		};
	}

	@handler({
		description: 'Set operation attributes',
		method:      'POST',
		path:        '/operations/:operationId/attributes',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getList,
		},
		validate: {
			params: joi.object().keys({
				operationId: joi.string().required(),
			}),
			body: joi.object().keys({
				ownCategory: joi.string(),
				ownComment:  joi.string().allow(null),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					operationId: joi.string().required(),
				}),
			}),
		},
	})
	public async setOperationAttributes (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.setOperationAttributes({
			counterpartyId: req.auth.counterpartyId!,
			operationId:    req.params.operationId,
			ownCategory:    req.body.ownCategory,
			ownComment:     req.body.ownComment,
		});

		return {
			operationId: result.operationId,
		};
	}

	@handler({
		description: 'Get suggestions',
		method:      'GET',
		path:        '/suggestions',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.OPERATION,
			action:   AuditAction.getSuggestions,
		},
		validate: {
			query: {
				types:    joi.array().items(joi.string()),
				limit:    joi.number(),
				category: joi.string(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number(),
					items: joi.array().items({
						id:                 joi.string(),
						type:               joi.string(),
						title:              joi.string(),
						description:        joi.string(),
						amount:             joi.number().positive(),
						iconId:             joi.string(),
						avatarUrl:          joi.string().allow(null),
						cardFromId:         joi.string(),
						cardToId:           joi.string().allow(null),
						contactId:          joi.string().allow(null),
						phoneBookContactId: joi.string().allow(null),
						panFromMasked:      joi.string(),
						panToMasked:        joi.string().allow(null),
						billingData:        joi.object().keys({
							serviceId:   joi.string(),
							category:    joi.string(),
							phone:       joi.string().allow(null),
							customTitle: joi.string().allow(null),
							fields:      joi.array().items(
								joi.object().keys({
									id:         joi.string().required(),
									key:        joi.string().required(),
									value:      joi.any(),
									isRequired: joi.boolean().required(),
									regular:    joi.object().keys({
										rawRegular:    joi.string().required(),
										multiLine:     joi.boolean().required(),
										caseSensitive: joi.boolean().required(),
									}).allow(null),
								}),
							).allow(null),
							fieldsSchemas: joi.array().items(
								joi.object(),
							).allow(null),
						}).allow(null),
						sepData: joi.object().keys({
							recipient: joi.string(),
							taxId:     joi.string(),
							iban:      joi.string(),
							purpose:   joi.string(),
						}).allow(null),
					}),
				}),
			}),
		},
	})
	public async listSuggestions (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.listSuggestions({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			limit:          req.query.limit,
			category:       req.query.category,
			types:          req.query.types,
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					id:                 item.id,
					type:               item.type,
					title:              item.title,
					description:        item.description,
					amount:             item.amount,
					iconId:             item.iconId,
					avatarUrl:          item.avatarUrl,
					cardFromId:         item.cardFromId,
					cardToId:           item.cardToId,
					contactId:          item.contactId,
					phoneBookContactId: item.phoneBookContactId,
					panFromMasked:      item.panFromMasked,
					panToMasked:        item.panToMasked,
					billingData:        item.billingData,
					sepData:            item.sepData,
				};
			}),
		};
	}
}
