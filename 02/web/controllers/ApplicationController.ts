import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {CrmServiceClient} from 'rpc/lib/CrmServiceClient';


export class ApplicationController {

	constructor (
		private crmServiceClient: CrmServiceClient,
	) {}

	@handler({
		description: 'Create First Card application',
		method:      'PUT',
		path:        '/applications',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.create,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					counterpartyId:  joi.string().guid().required(),
					flowId:          joi.string().guid().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					status:          joi.string().required(),
					accountId:       joi.string().guid().required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async createApplicationFirstCard (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.createApplicationFirstCard({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			applicationId:   result.applicationId,
			counterpartyId:  result.counterpartyId,
			flowId:          result.flowId,
			productName:     result.productName,
			currency:        result.currency,
			status:          result.status,
			type:            result.type,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}

	@handler({
		description: 'Create Foreign Card application',
		method:      'PUT',
		path:        '/applications/foreign-card',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				currency: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					counterpartyId:  joi.string().guid().required(),
					flowId:          joi.string().guid().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					status:          joi.string().required(),
					accountId:       joi.string().guid().required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async createApplicationForeignCard (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.createApplicationForeignCard({
			counterpartyId: req.auth.counterpartyId!,
			currency:       req.body.currency,
		});

		return {
			applicationId:   result.applicationId,
			counterpartyId:  result.counterpartyId,
			flowId:          result.flowId,
			productName:     result.productName,
			currency:        result.currency,
			status:          result.status,
			type:            result.type,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}

	@handler({
		description: 'Create application for card reissue. New version',
		method:      'PUT',
		path:        '/applications/card-reissue/v2',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				reissueCardId: joi.string().guid().required(),
				productName:   joi.string().required(),
				shipperType:   joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					counterpartyId:  joi.string().guid().required(),
					flowId:          joi.string().guid().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					status:          joi.string().required(),
					accountId:       joi.string().guid().required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async createCardReissueApplicationV2 (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.createCardReissueApplication({
			counterpartyId: req.auth.counterpartyId!,
			reissueCardId:  req.body.reissueCardId,
			productName:    req.body.productName,
			shipperType:    req.body.shipperType,
		});

		return {
			applicationId:   result.applicationId,
			counterpartyId:  result.counterpartyId,
			flowId:          result.flowId,
			productName:     result.productName,
			status:          result.status,
			type:            result.type,
			currency:        result.currency,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}

	@handler({
		description: 'Create application for reidentification',
		method:      'PUT',
		path:        '/applications/reidentification/',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.create,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					counterpartyId:  joi.string().guid().required(),
					flowId:          joi.string().guid().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					status:          joi.string().required(),
					accountId:       joi.string().guid().required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async createReidentificationApplication (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.createReidentificationApplication({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			applicationId:   result.applicationId,
			counterpartyId:  result.counterpartyId,
			flowId:          result.flowId,
			productName:     result.productName,
			status:          result.status,
			type:            result.type,
			currency:        result.currency,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}

	@handler({
		description: 'Create close account application',
		method:      'PUT',
		path:        '/applications/close-account/',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				cardId:     joi.string().guid().required(),
				sepOutData: joi.object().keys({
					recipient: joi.string().max(40).required(),
					taxId:     joi.string().regex(/^\d+$/).max(10).required(),
					iban:      joi.string().regex(/^UA\d+$/).length(29).required(),
				}),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					counterpartyId:  joi.string().guid().required(),
					flowId:          joi.string().guid().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					status:          joi.string().required(),
					accountId:       joi.string().guid().required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async createCloseAccountApplication (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.createCloseAccountApplication({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.body.cardId,
			sepOutData:     req.body.sepOutData ? {
				recipient: req.body.sepOutData.recipient,
				taxId:     req.body.sepOutData.taxId,
				iban:      req.body.sepOutData.iban,
			} : undefined,
		});

		return {
			applicationId:   result.applicationId,
			counterpartyId:  result.counterpartyId,
			flowId:          result.flowId,
			productName:     result.productName,
			status:          result.status,
			type:            result.type,
			currency:        result.currency,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}


	@handler({
		description: 'Create Delivery Order',
		method:      'POST',
		path:        '/flows/:flowId/order/create',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.createDeliveryOrder,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				shipperId:   joi.string().required(),
				warehouseId: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async createDeliveryOrder (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.createDeliveryOrder({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			deliveryData:   {
				shipperId:   req.body.shipperId,
				warehouseId: req.body.warehouseId,
			},
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Fetch Delivery Order',
		method:      'POST',
		path:        '/flows/:flowId/order/fetch',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async fetchDeliveryOrder (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.fetchDeliveryOrder({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Get info for card reissue',
		method:      'GET',
		path:        '/applications/reissue/:reissueCardId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.APPLICATION,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				reissueCardId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					reissueCards: joi.array().items(joi.object().keys({
						productName:     joi.string(),
						cardReissueCost: joi.number(),
					})),
				}),
			}),
		},
	})
	public async getCardReissueInfo (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.getCardReissueInfo({
			counterpartyId: req.auth.counterpartyId!,
			reissueCardId:  req.params.reissueCardId,
		});

		return {
			reissueCards: result.reissueCards,
		};
	}

	@handler({
		description: 'Select Application Product',
		method:      'POST',
		path:        '/flows/:flowId/product',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.selectProduct,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				productName: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async selectProduct (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.selectProduct({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			productName:    req.body.productName,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Select Identification Document Source',
		method:      'POST',
		path:        '/flows/:flowId/document-source',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.selectDocument,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				documentSource: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async selectDocumentSource (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.selectDocumentSource({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			documentSource: req.body.documentSource,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Upload photos of documents',
		method:      'POST',
		path:        '/flows/:flowId/document',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.uploadFiles,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				type:  joi.string().required(),
				files: joi.array().items(
					joi.string().required(),
				).required(),

			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async uploadDocument (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.uploadDocumentByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			documentType:   req.body.type,
			files:          req.body.files,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Update counterparty living and registration addresses',
		method:      'POST',
		path:        '/flows/:flowId/address',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.modifyAddress,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				livingAddress: joi.object().keys({
					region:    joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(40).allow(''),
					district:  joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(40).allow(''),
					city:      joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(60).required(),
					street:    joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(50).required(),
					house:     joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(30).required(),
					apartment: joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(20).allow('').required(),
				}).required(),
				registrationAddress: joi.object().keys({
					region:    joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(40).allow(''),
					district:  joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(40).allow(''),
					city:      joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(60).required(),
					street:    joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(50).required(),
					house:     joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(30).required(),
					apartment: joi.string().trim().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(20).allow('').required(),
				}),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async updateAddressForApplication (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.updateAddressByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			livingAddress:  {
				region:    req.body.livingAddress.region || null,
				district:  req.body.livingAddress.district || null,
				city:      req.body.livingAddress.city,
				street:    req.body.livingAddress.street,
				house:     req.body.livingAddress.house,
				apartment: req.body.livingAddress.apartment || null,
			},
			registrationAddress: req.body.registrationAddress ? {
				region:    req.body.registrationAddress.region || null,
				district:  req.body.registrationAddress.district || null,
				city:      req.body.registrationAddress.city,
				street:    req.body.registrationAddress.street,
				house:     req.body.registrationAddress.house,
				apartment: req.body.registrationAddress.apartment || null,
			} : undefined,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Update flow form',
		method:      'POST',
		path:        '/flows/:flowId/form/v3',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateForm,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				email:               joi.string().trim().email({tlds: false}),
				typeOfEmployment:    joi.string().regex(/^\d*$/).required(),
				jobPosition:         joi.string().regex(/^\d*$/).max(84),
				companyName:         joi.string().regex(/^([а-яіїёєґa-z0-9$-/:-?{-~!"^_`[\] ]+)/i).max(254).trim(),
				incomeTypeId:        joi.string().regex(/^\d*$/).required(),
				income:              joi.number().required(),
				requestedLimit:      joi.number().required(),
				isOwnForeignCompany: joi.boolean().required(),

				isResidentOfRfBy:             joi.boolean().required(),
				isOwnPropertiesInRfBy:        joi.boolean().required(),
				isFinancialOperationWithRfBy: joi.boolean().required(),
			}).options({allowUnknown: true}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async updateFormV3 (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.updateFormByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			form:           {
				email:                        req.body.email,
				typeOfEmploymentId:           req.body.typeOfEmployment,
				jobPositionId:                req.body.jobPosition || null,
				companyName:                  req.body.companyName || null,
				incomes:                      [{incomeTypeId: req.body.incomeTypeId, income: req.body.income}],
				requestedLimit:               req.body.requestedLimit,
				isOwnForeignCompany:          req.body.isOwnForeignCompany,
				isResidentOfRfBy:             req.body.isResidentOfRfBy,
				isOwnPropertiesInRfBy:        req.body.isOwnPropertiesInRfBy,
				isFinancialOperationWithRfBy: req.body.isFinancialOperationWithRfBy,
			},
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Attach card to user',
		method:      'POST',
		path:        '/flows/:flowId/card',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.attachCard,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				cardCode: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async attachCard (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.attachCardByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			cardCode:       req.body.cardCode,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Attach card style to card',
		method:      'POST',
		path:        '/flows/:flowId/card/style',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				designCode: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async attachCardStyle (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.attachCardStyle({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			designCode:     req.body.designCode,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Approve user form',
		method:      'POST',
		path:        '/flows/:flowId/forms/approve',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async approveFormByUser (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.approveFormByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			isApproved:     true,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Decline user form',
		method:      'POST',
		path:        '/flows/:flowId/forms/decline',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async declineFormByUser (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.approveFormByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			isApproved:     false,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Complete step PENDING_REVERT_DATA',
		method:      'POST',
		path:        '/flows/:flowId/revert/pending',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async pendingRevertDataByUser (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.pendingRevertDataByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Approve sign contract',
		method:      'POST',
		path:        '/flows/:flowId/accession-contract/approve',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.updateFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async approveSignContractByUser (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.approveSignContractByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Revert flow steps',
		method:      'POST',
		path:        '/flows/:flowId/revert',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.revertFlow,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
			body: joi.object().keys({
				stepName:    joi.string(),
				repeatSteps: joi.array().items(joi.string()),
				comment:     joi.string(),
			}).xor('stepName', 'repeatSteps'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					step:             joi.object().keys({
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					}),
				}),
			}),
		},
	})
	public async revertFlowState (req: RequestObj): Promise<object> {
		const params = req.body.stepName ? {
			stepName: req.body.stepName,
		} : {
			repeatSteps: req.body.repeatSteps || [],
		};
		const result = await this.crmServiceClient.revertFlowStepsByUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
			data:           params,
			comment:        req.body.comment,
		});

		return {
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'List active counterparty flows',
		method:      'GET',
		path:        '/flows/active',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.getList,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(joi.object().keys({
						flowId:           joi.string().guid().required(),
						applicationId:    joi.string().guid().allow(null).required(),
						identificationId: joi.string().guid().allow(null).required(),
						verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
						counterpartyId:   joi.string().guid().required(),
						returnToSteps:    joi.array().items(joi.string()),
						documentSource:   joi.string().allow(null).required(),
						productName:      joi.string().allow(null).required(),
						step:             {
							flowId:     joi.string().guid().required(),
							flowStepId: joi.string().guid().required(),
							stepName:   joi.string().required(),
							executor:   joi.string().required(),
							state:      joi.string().required(),
							data:       joi.object().allow(null).required(),
							createdAt:  joi.date().required(),
							updatedAt:  joi.date().required(),
						},
					})).required(),
				}),
			}),
		},
	})
	public async listActiveFlows (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.listActiveFlowsForUser({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					flowId:           it.flowId,
					applicationId:    it.applicationId,
					identificationId: it.identificationId,
					verificationId:   it.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   it.counterpartyId,
					returnToSteps:    it.returnToSteps,
					documentSource:   it.documentSource,
					productName:      it.productName,
					step:             {
						flowId:     it.step.flowId,
						flowStepId: it.step.flowStepId,
						stepName:   it.step.stepName,
						executor:   it.step.executor,
						state:      it.step.state,
						data:       it.step.data,
						createdAt:  it.step.createdAt,
						updatedAt:  it.step.updatedAt,
					},
				};
			}),
		};
	}

	@handler({
		description: 'Show current flow state',
		method:      'GET',
		path:        '/flows/:flowId/state',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				flowId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					flowId:           joi.string().guid().required(),
					applicationId:    joi.string().guid().allow(null).required(),
					identificationId: joi.string().guid().allow(null).required(),
					verificationId:   joi.string().guid().allow(null).required(), // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
					counterpartyId:   joi.string().guid().required(),
					returnToSteps:    joi.array().items(joi.string()),
					documentSource:   joi.string().allow(null).required(),
					productName:      joi.string().allow(null).required(),
					step:             {
						flowId:     joi.string().guid().required(),
						flowStepId: joi.string().guid().required(),
						stepName:   joi.string().required(),
						executor:   joi.string().required(),
						state:      joi.string().required(),
						data:       joi.object().allow(null).required(),
						createdAt:  joi.date().required(),
						updatedAt:  joi.date().required(),
					},
				}),
			}),
		},
	})
	public async showFlowState (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.showFlowStateForUser({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.params.flowId,
		});

		return {
			flowId:           result.flowId,
			applicationId:    result.applicationId,
			identificationId: result.identificationId,
			verificationId:   result.identificationId, // удалить после повышения MIN_SUPPORTED_VERSION=1.41.0
			counterpartyId:   result.counterpartyId,
			returnToSteps:    result.returnToSteps,
			documentSource:   result.documentSource,
			productName:      result.productName,
			step:             {
				flowId:     result.step.flowId,
				flowStepId: result.step.flowStepId,
				stepName:   result.step.stepName,
				executor:   result.step.executor,
				state:      result.step.state,
				data:       result.step.data,
				createdAt:  result.step.createdAt,
				updatedAt:  result.step.updatedAt,
			},
		};
	}

	@handler({
		description: 'Get credit form data',
		method:      'GET',
		path:        '/forms/:formId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				formId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					formId: joi.string().guid().required(),

					email:        joi.string().email().allow(null).required(),
					firstName:    joi.string().allow(null).required(),
					lastName:     joi.string().allow(null).required(),
					patronymic:   joi.string().allow(null).required(),
					birthDate:    joi.string().allow(null).required(),
					placeOfBirth: joi.string().allow(null).required(),
					passportData: joi.object().keys({
						series:   joi.string().allow(null).required(),
						number:   joi.string().allow(null).required(),
						issuedAt: joi.string().allow(null).required(),
						issuedBy: joi.string().allow(null).required(),
					}).allow(null).required(),
					passportIdData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).allow(null).required(),
					foreignPassportData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						series:       joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).allow(null).required(),

					typeOfEmployment: joi.string().allow(null),
					jobPosition:      joi.string(),
					companyName:      joi.string(),
					durationOfWork:   joi.string(),
					incomes:          joi.array().items(joi.object().keys({
						incomeTypeId: joi.string().required(),
						income:       joi.number().required(),
					})).required(),
					requestedLimit: joi.number().required(),
					isEntrepreneur: joi.boolean().required(),
					isPublicPerson: joi.boolean().required(),
					martialStatus:  joi.string().required(),
					livingAddress:  joi.object().keys({
						region:    joi.string().allow(''),
						district:  joi.string().allow(''),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						apartment: joi.string().allow('').required(),
					}).required(),
					registrationAddress: joi.object().keys({
						region:    joi.string().allow(''),
						district:  joi.string().allow(''),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						apartment: joi.string().allow('').required(),
					}).required(),

					isOwnForeignCompany:               joi.boolean().required(),
					isRelativeOfEpbHeadsOrControllers: joi.boolean().required(),
					ownAppartment:                     joi.boolean().required(),
					ownHouse:                          joi.boolean().required(),
					ownCar:                            joi.boolean().required(),
					otherOwnProperties:                joi.string(),

					isResidentOfRfBy:             joi.boolean(),
					isOwnPropertiesInRfBy:        joi.boolean(),
					isFinancialOperationWithRfBy: joi.boolean(),
				}),
			}),
		},
	})
	public async showForm (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.showFormForUser({
			counterpartyId: req.auth.counterpartyId!,
			formId:         req.params.formId,
		});

		return {
			formId: result.formId,

			email:        result.email,
			firstName:    result.firstName,
			lastName:     result.lastName,
			patronymic:   result.patronymic,
			birthDate:    result.birthDate,
			placeOfBirth: result.placeOfBirth,

			passportData: result.passportData ? {
				series:          result.passportData.series,
				number:          result.passportData.number,
				issuedAt:        result.passportData.issuedAt,
				issuedBy:        result.passportData.issuedBy,
				lastPhotoTypeId: result.passportData.lastPhotoTypeId,
				lastPhotoDate:   result.passportData.lastPhotoDate,
			} : null,
			passportIdData: result.passportIdData ? {
				number:       result.passportIdData.number,
				issuedAt:     result.passportIdData.issuedAt,
				issuedBy:     result.passportIdData.issuedBy,
				validUntil:   result.passportIdData.validUntil,
				recordNumber: result.passportIdData.recordNumber,
			} : null,
			foreignPassportData: result.foreignPassportData ? {
				series:       result.foreignPassportData.series,
				number:       result.foreignPassportData.number,
				issuedAt:     result.foreignPassportData.issuedAt,
				issuedBy:     result.foreignPassportData.issuedBy,
				validUntil:   result.foreignPassportData.validUntil,
				recordNumber: result.foreignPassportData.recordNumber,
			} : null,
			typeOfEmployment:    result.typeOfEmployment,
			jobPosition:         result.jobPosition,
			companyName:         result.companyName,
			durationOfWork:      result.durationOfWork,
			incomes:             result.incomes,
			requestedLimit:      result.requestedLimit,
			isEntrepreneur:      result.isEntrepreneur,
			isPublicPerson:      result.isPublicPerson,
			martialStatus:       result.martialStatus,
			registrationAddress: result.registrationAddress ? {
				region:    result.registrationAddress.region,
				district:  result.registrationAddress.district,
				city:      result.registrationAddress.city,
				street:    result.registrationAddress.street,
				house:     result.registrationAddress.house,
				apartment: result.registrationAddress.apartment,
			} : null,
			livingAddress: result.livingAddress ? {
				region:    result.livingAddress.region,
				district:  result.livingAddress.district,
				city:      result.livingAddress.city,
				street:    result.livingAddress.street,
				house:     result.livingAddress.house,
				apartment: result.livingAddress.apartment,
			} : null,

			isOwnForeignCompany:               result.isOwnForeignCompany || false,
			isRelativeOfEpbHeadsOrControllers: result.isRelativeOfEpbHeadsOrControllers || false,
			ownAppartment:                     result.ownProperties?.appartment || false,
			ownHouse:                          result.ownProperties?.house || false,
			ownCar:                            result.ownProperties?.car || false,
			otherOwnProperties:                result.ownProperties?.otherOwnProperties,
			isResidentOfRfBy:                  result.isResidentOfRfBy || false,
			isOwnPropertiesInRfBy:             result.isOwnPropertiesInRfBy || false,
			isFinancialOperationWithRfBy:      result.isFinancialOperationWithRfBy || false,
		};
	}

	@handler({
		description: 'Get credit form data',
		method:      'GET',
		path:        '/forms/:formId/v2',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				formId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					formId: joi.string().guid().required(),

					email:        joi.string().email().allow(null).required(),
					firstName:    joi.string().allow(null).required(),
					lastName:     joi.string().allow(null).required(),
					patronymic:   joi.string().allow(null).required(),
					birthDate:    joi.string().allow(null).required(),
					placeOfBirth: joi.string().allow(null).required(),
					passportData: joi.object().keys({
						series:   joi.string().allow(null).required(),
						number:   joi.string().allow(null).required(),
						issuedAt: joi.string().allow(null).required(),
						issuedBy: joi.string().allow(null).required(),
					}).allow(null).required(),
					passportIdData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).allow(null).required(),
					foreignPassportData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						series:       joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).allow(null).required(),

					typeOfEmployment: joi.string().allow(null),
					jobPosition:      joi.string(),
					companyName:      joi.string(),
					durationOfWork:   joi.string(),
					incomeTypeId:     joi.string().allow(null),
					income:           joi.number().allow(null),
					requestedLimit:   joi.number().required(),
					isEntrepreneur:   joi.boolean().required(),
					isPublicPerson:   joi.boolean().required(),
					martialStatus:    joi.string().required(),
					livingAddress:    joi.object().keys({
						region:    joi.string().allow(''),
						district:  joi.string().allow(''),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						apartment: joi.string().allow('').required(),
					}).required(),
					registrationAddress: joi.object().keys({
						region:    joi.string().allow(''),
						district:  joi.string().allow(''),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						apartment: joi.string().allow('').required(),
					}).required(),

					isOwnForeignCompany:               joi.boolean().required(),
					isRelativeOfEpbHeadsOrControllers: joi.boolean().required(),
					ownAppartment:                     joi.boolean().required(),
					ownHouse:                          joi.boolean().required(),
					ownCar:                            joi.boolean().required(),
					otherOwnProperties:                joi.string(),

					isResidentOfRfBy:             joi.boolean(),
					isOwnPropertiesInRfBy:        joi.boolean(),
					isFinancialOperationWithRfBy: joi.boolean(),
				}),
			}),
		},
	})
	public async showFormV2 (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.showFormForUser({
			counterpartyId: req.auth.counterpartyId!,
			formId:         req.params.formId,
		});

		const incomeObj = result.incomes !== null && result.incomes.length > 0 ? result.incomes[0] : null;

		return {
			formId: result.formId,

			email:        result.email,
			firstName:    result.firstName,
			lastName:     result.lastName,
			patronymic:   result.patronymic,
			birthDate:    result.birthDate,
			placeOfBirth: result.placeOfBirth,

			passportData: result.passportData ? {
				series:          result.passportData.series,
				number:          result.passportData.number,
				issuedAt:        result.passportData.issuedAt,
				issuedBy:        result.passportData.issuedBy,
				lastPhotoTypeId: result.passportData.lastPhotoTypeId,
				lastPhotoDate:   result.passportData.lastPhotoDate,
			} : null,
			passportIdData: result.passportIdData ? {
				number:       result.passportIdData.number,
				issuedAt:     result.passportIdData.issuedAt,
				issuedBy:     result.passportIdData.issuedBy,
				validUntil:   result.passportIdData.validUntil,
				recordNumber: result.passportIdData.recordNumber,
			} : null,
			foreignPassportData: result.foreignPassportData ? {
				series:       result.foreignPassportData.series,
				number:       result.foreignPassportData.number,
				issuedAt:     result.foreignPassportData.issuedAt,
				issuedBy:     result.foreignPassportData.issuedBy,
				validUntil:   result.foreignPassportData.validUntil,
				recordNumber: result.foreignPassportData.recordNumber,
			} : null,
			typeOfEmployment:    result.typeOfEmployment,
			jobPosition:         result.jobPosition,
			companyName:         result.companyName,
			durationOfWork:      result.durationOfWork,
			incomeTypeId:        incomeObj ? incomeObj.type : null,
			income:              incomeObj ? incomeObj.income : null,
			requestedLimit:      result.requestedLimit,
			isEntrepreneur:      result.isEntrepreneur,
			isPublicPerson:      result.isPublicPerson,
			martialStatus:       result.martialStatus,
			registrationAddress: result.registrationAddress ? {
				region:    result.registrationAddress.region,
				district:  result.registrationAddress.district,
				city:      result.registrationAddress.city,
				street:    result.registrationAddress.street,
				house:     result.registrationAddress.house,
				apartment: result.registrationAddress.apartment,
			} : null,
			livingAddress: result.livingAddress ? {
				region:    result.livingAddress.region,
				district:  result.livingAddress.district,
				city:      result.livingAddress.city,
				street:    result.livingAddress.street,
				house:     result.livingAddress.house,
				apartment: result.livingAddress.apartment,
			} : null,

			isOwnForeignCompany:               result.isOwnForeignCompany || false,
			isRelativeOfEpbHeadsOrControllers: result.isRelativeOfEpbHeadsOrControllers || false,
			ownAppartment:                     result.ownProperties?.appartment || false,
			ownHouse:                          result.ownProperties?.house || false,
			ownCar:                            result.ownProperties?.car || false,
			otherOwnProperties:                result.ownProperties?.otherOwnProperties,
			isResidentOfRfBy:                  result.isResidentOfRfBy || false,
			isOwnPropertiesInRfBy:             result.isOwnPropertiesInRfBy || false,
			isFinancialOperationWithRfBy:      result.isFinancialOperationWithRfBy || false,
		};
	}

	@handler({
		description: 'Get credit form data',
		method:      'GET',
		path:        '/forms/:formId/v3',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				formId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					formId: joi.string().guid().required(),

					email:        joi.string().email().allow(null).required(),
					firstName:    joi.string().allow(null).required(),
					lastName:     joi.string().allow(null).required(),
					patronymic:   joi.string().allow(null).required(),
					birthDate:    joi.string().allow(null).required(),
					placeOfBirth: joi.string().allow(null).required(),
					passportData: joi.object().keys({
						series:   joi.string().allow(null).required(),
						number:   joi.string().allow(null).required(),
						issuedAt: joi.string().allow(null).required(),
						issuedBy: joi.string().allow(null).required(),
					}).allow(null).required(),
					passportIdData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).allow(null).required(),
					foreignPassportData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						series:       joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).allow(null).required(),

					typeOfEmployment: joi.string().allow(null),
					jobPosition:      joi.string(),
					companyName:      joi.string(),
					durationOfWork:   joi.string(),
					incomeTypeId:     joi.string().allow(null),
					income:           joi.number().allow(null),
					requestedLimit:   joi.number().required(),
					isEntrepreneur:   joi.boolean().required(),
					isPublicPerson:   joi.boolean().required(),
					martialStatus:    joi.string().required(),
					livingAddress:    joi.object().keys({
						region:    joi.string().allow(''),
						district:  joi.string().allow(''),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						apartment: joi.string().allow('').required(),
					}).required(),
					registrationAddress: joi.object().keys({
						region:    joi.string().allow(''),
						district:  joi.string().allow(''),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						apartment: joi.string().allow('').required(),
					}).required(),

					isOwnForeignCompany:               joi.boolean().required().allow(null),
					isRelativeOfEpbHeadsOrControllers: joi.boolean().required().allow(null),
					ownAppartment:                     joi.boolean().required(),
					ownHouse:                          joi.boolean().required(),
					ownCar:                            joi.boolean().required(),
					otherOwnProperties:                joi.string(),

					isResidentOfRfBy:             joi.boolean().allow(null),
					isOwnPropertiesInRfBy:        joi.boolean().allow(null),
					isFinancialOperationWithRfBy: joi.boolean().allow(null),
				}),
			}),
		},
	})
	public async showFormV3 (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.showFormForUser({
			counterpartyId: req.auth.counterpartyId!,
			formId:         req.params.formId,
		});

		const incomeObj = result.incomes !== null && result.incomes.length > 0 ? result.incomes[0] : null;

		return {
			formId: result.formId,

			email:        result.email,
			firstName:    result.firstName,
			lastName:     result.lastName,
			patronymic:   result.patronymic,
			birthDate:    result.birthDate,
			placeOfBirth: result.placeOfBirth,

			passportData: result.passportData ? {
				series:          result.passportData.series,
				number:          result.passportData.number,
				issuedAt:        result.passportData.issuedAt,
				issuedBy:        result.passportData.issuedBy,
				lastPhotoTypeId: result.passportData.lastPhotoTypeId,
				lastPhotoDate:   result.passportData.lastPhotoDate,
			} : null,
			passportIdData: result.passportIdData ? {
				number:       result.passportIdData.number,
				issuedAt:     result.passportIdData.issuedAt,
				issuedBy:     result.passportIdData.issuedBy,
				validUntil:   result.passportIdData.validUntil,
				recordNumber: result.passportIdData.recordNumber,
			} : null,
			foreignPassportData: result.foreignPassportData ? {
				series:       result.foreignPassportData.series,
				number:       result.foreignPassportData.number,
				issuedAt:     result.foreignPassportData.issuedAt,
				issuedBy:     result.foreignPassportData.issuedBy,
				validUntil:   result.foreignPassportData.validUntil,
				recordNumber: result.foreignPassportData.recordNumber,
			} : null,
			typeOfEmployment:    result.typeOfEmployment,
			jobPosition:         result.jobPosition,
			companyName:         result.companyName,
			durationOfWork:      result.durationOfWork,
			incomeTypeId:        incomeObj ? incomeObj.type : null,
			income:              incomeObj ? incomeObj.income : null,
			requestedLimit:      result.requestedLimit,
			isEntrepreneur:      result.isEntrepreneur,
			isPublicPerson:      result.isPublicPerson,
			martialStatus:       result.martialStatus,
			registrationAddress: result.registrationAddress ? {
				region:    result.registrationAddress.region,
				district:  result.registrationAddress.district,
				city:      result.registrationAddress.city,
				street:    result.registrationAddress.street,
				house:     result.registrationAddress.house,
				apartment: result.registrationAddress.apartment,
			} : null,
			livingAddress: result.livingAddress ? {
				region:    result.livingAddress.region,
				district:  result.livingAddress.district,
				city:      result.livingAddress.city,
				street:    result.livingAddress.street,
				house:     result.livingAddress.house,
				apartment: result.livingAddress.apartment,
			} : null,

			isOwnForeignCompany:               result.isOwnForeignCompany,
			isRelativeOfEpbHeadsOrControllers: result.isRelativeOfEpbHeadsOrControllers,
			ownAppartment:                     result.ownProperties?.appartment || false,
			ownHouse:                          result.ownProperties?.house || false,
			ownCar:                            result.ownProperties?.car || false,
			otherOwnProperties:                result.ownProperties?.otherOwnProperties,
			isResidentOfRfBy:                  result.isResidentOfRfBy,
			isOwnPropertiesInRfBy:             result.isOwnPropertiesInRfBy,
			isFinancialOperationWithRfBy:      result.isFinancialOperationWithRfBy,
		};
	}

	@handler({
		description: 'List identifications',
		method:      'GET',
		path:        '/identifications',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.getList,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(joi.object().keys({
						identificationId: joi.string().guid().required(),
						counterpartyId:   joi.string().guid().required(),
						status:           joi.string().required(),
						operatorId:       joi.string().allow(null).required(),
						formId:           joi.string().allow(null).required(),
						expiredAt:        joi.date().allow(null).required(),
						createdAt:        joi.date().required(),
						updatedAt:        joi.date().required(),
					})).required(),
				}),
			}),
		},
	})
	public async listIdentifications (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.listIdentifications({
			filter: {
				counterpartyId: req.auth.counterpartyId!,
			},
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					identificationId: it.identificationId,
					counterpartyId:   it.counterpartyId,
					status:           it.status,
					operatorId:       it.operatorId,
					formId:           it.formId,
					expiredAt:        it.expiredAt,
					createdAt:        it.createdAt,
					updatedAt:        it.updatedAt,
				};
			}),
		};
	}

	@handler({
		description: 'List applications v2 with currency',
		method:      'GET',
		path:        '/applications/v2',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.getList,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(joi.object().keys({
						applicationId:   joi.string().guid().required(),
						flowId:          joi.string().guid().allow(null).required(),
						counterpartyId:  joi.string().guid().required(),
						status:          joi.string().required(),
						type:            joi.string().required(),
						currency:        joi.string().allow(null).required(),
						productName:     joi.string().allow(null).required(),
						deliveryOrderId: joi.string().allow(null).required(),
						accountId:       joi.string().allow(null).required(),
						cardId:          joi.string().allow(null).required(),
						reissueCardId:   joi.string().allow(null).required(),
						createdAt:       joi.date().required(),
						updatedAt:       joi.date().required(),
					})).required(),
				}),
			}),
		},
	})
	public async listApplicationsV2 (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.listApplicationsForUser({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					applicationId:   it.applicationId,
					flowId:          it.flowId,
					counterpartyId:  it.counterpartyId,
					status:          it.status,
					type:            it.type,
					currency:        it.currency,
					productName:     it.productName,
					accountId:       it.accountId,
					deliveryOrderId: it.deliveryOrderId,
					cardId:          it.cardId,
					reissueCardId:   it.reissueCardId,
					createdAt:       it.createdAt,
					updatedAt:       it.updatedAt,
				};
			}),
		};
	}

	// @DEPRECATED, uses only for UAH currency
	@handler({
		description: 'Get list actual products',
		method:      'GET',
		path:        '/products',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				applicationType: joi.string().allow('CARD_REISSUE').required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					productsNames: joi.array().items(joi.string()),
				}),
			}),
		},
	})
	public async listProducts (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.listProducts({
			applicationType: req.query.applicationType,
		});

		return {
			productsNames: result.productsNames,
		};
	}

	@handler({
		description: 'Show Application by id',
		method:      'GET',
		path:        '/applications/:applicationId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.APPLICATION,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				applicationId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					flowId:          joi.string().guid().allow(null).required(),
					counterpartyId:  joi.string().guid().required(),
					status:          joi.string().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					accountId:       joi.string().allow(null).required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async showApplication (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.showApplication({
			counterpartyId: req.auth.counterpartyId!,
			applicationId:  req.params.applicationId,
		});

		return {
			applicationId:   result.applicationId,
			flowId:          result.flowId,
			counterpartyId:  result.counterpartyId,
			status:          result.status,
			type:            result.type,
			currency:        result.currency,
			productName:     result.productName,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}

	@handler({
		description: 'Reject close account application',
		method:      'POST',
		path:        '/applications/:applicationId/close-account/reject',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.FLOW,
			action:   AuditAction.create,
		},
		validate: {
			params: joi.object().keys({
				applicationId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					applicationId:   joi.string().guid().required(),
					counterpartyId:  joi.string().guid().required(),
					flowId:          joi.string().guid().required(),
					type:            joi.string().required(),
					currency:        joi.string().allow(null).required(),
					productName:     joi.string().allow(null).required(),
					status:          joi.string().required(),
					accountId:       joi.string().guid().required(),
					cardId:          joi.string().allow(null).required(),
					reissueCardId:   joi.string().allow(null).required(),
					deliveryOrderId: joi.string().allow(null).required(),
					createdAt:       joi.date().required(),
					updatedAt:       joi.date().required(),
				}),
			}),
		},
	})
	public async rejectCloseAccountApplicationById (req: RequestObj): Promise<object> {
		const result = await this.crmServiceClient.rejectCloseAccountApplicationById({
			counterpartyId: req.auth.counterpartyId!,
			applicationId:  req.params.applicationId,
		});

		return {
			applicationId:   result.applicationId,
			counterpartyId:  result.counterpartyId,
			flowId:          result.flowId,
			productName:     result.productName,
			status:          result.status,
			type:            result.type,
			currency:        result.currency,
			cardId:          result.cardId,
			reissueCardId:   result.reissueCardId,
			accountId:       result.accountId,
			deliveryOrderId: result.deliveryOrderId,
			createdAt:       result.createdAt,
			updatedAt:       result.updatedAt,
		};
	}

}
