import joi from 'app/lib/app/Validator';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuditAction, AuditCategory, handler} from '../decorators';

import {IdentificationServiceClient} from 'rpc/lib/IdentificationServiceClient';
import {AuthType} from '../auth/auth.types';


export class IdentificationController {

	constructor (
		private identificationServiceClient: IdentificationServiceClient,
	) {}

	@handler({
		description: 'Get deep link',
		method:      'GET',
		path:        '/identification/deeplink',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.IDENTIFICATION,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				flowId:   joi.string().guid().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
				provider: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					deepLink: joi.string().required(),
				}),
			}),
		},
	})
	public async getIdentificationDeepLink (req: RequestObj): Promise<object> {
		const identificationDeepLink = await this.identificationServiceClient.startIdentification({
			counterpartyId: req.auth.counterpartyId!,
			flowId:         req.query.flowId,
			provider:       req.query.provider,
		});

		return {
			deepLink: identificationDeepLink.deepLink,
		};
	}

	// @handler({
	// 	description: 'Get redirect url',
	// 	method:      'GET',
	// 	path:        '/detection/link',
	// 	auth:        AuthType.User,
	// 	audit:       {
	// 		category: AuditCategory.DETECTION,
	// 		action:   AuditAction.get,
	// 	},
	// 	validate: {
	// 		query: joi.object().keys({
	// 			applicationId: joi.string().guid().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i).required(),
	// 			provider:      joi.string(),
	// 		}),
	// 	},
	// 	response: {
	// 		200: joi.object().keys({
	// 			data: joi.object().keys({
	// 				detectionId:               joi.string().required(),
	// 				redirectUrl:               joi.string().required(),
	// 				redirectAfterDetectionUrl: joi.string().required(),
	// 			}),
	// 		}),
	// 	},
	// })
	// public async getDetectionRedirectUrl (req: RequestObj): Promise<object> {
	// 	const result = await this.identificationServiceClient.startDetection({
	// 		counterpartyId: req.auth.counterpartyId!,
	// 		applicationId:  req.query.applicationId,
	// 		provider:       req.query.provider ?? 'EVERGREEN',
	// 		lg:             req.auth.lg!,
	// 	});

	// 	return {
	// 		detectionId:               result.detectionId,
	// 		redirectUrl:               result.redirectUrl,
	// 		redirectAfterDetectionUrl: result.redirectAfterDetectionUrl,
	// 	};
	// }

	@handler({
		description: 'Show detection',
		method:      'GET',
		path:        '/detection/:detectionId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DETECTION,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				detectionId: joi.string().guid().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					detectionId:    joi.string().guid().required(),
					counterpartyId: joi.string().guid().required(),
					flowId:         joi.string().guid().required(),
					providerId:     joi.string().required(),
					redirectUrl:    joi.string().allow(null).required(),
					type:           joi.string().required(),
					status:         joi.string().required(),
					providerData:   joi.any(),
					similarity:     joi.string().allow(null).required(),
					finishedAt:     joi.date().allow(null).required(),
					rejectedAt:     joi.date().allow(null).required(),
					createdAt:      joi.date().allow(null).required(),
					updatedAt:      joi.date().allow(null).required(),
				}),
			}),
		},
	})
	public async showDetection (req: RequestObj): Promise<object> {
		const result = await this.identificationServiceClient.showDetection({
			detectionId: req.params.detectionId,
		});

		return {
			detectionId:    result.id,
			counterpartyId: result.counterpartyId,
			flowId:         result.flowId,
			providerId:     result.providerId,
			redirectUrl:    result.redirectUrl,
			type:           result.type,
			status:         result.status,
			providerData:   result.providerData,
			similarity:     result.similarity,
			finishedAt:     result.finishedAt,
			rejectedAt:     result.rejectedAt,
			createdAt:      result.createdAt,
			updatedAt:      result.updatedAt,
		};
	}
}
