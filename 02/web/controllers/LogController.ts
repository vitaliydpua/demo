import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';
import {LogServiceClient} from 'rpc/lib/LogServiceClient';


export class LogController {

	constructor (
		private logServiceClient: LogServiceClient,
	) {}

	@handler({
		description: 'Get current log key',
		method:      'GET',
		path:        '/logs/current-key',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.LOG,
			action:   AuditAction.getKey,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					logKeyId:  joi.string().required(),
					publicKey: joi.string().required(),
				}),
			}),
		},
	})
	public async getActiveLogKey (): Promise<object> {
		const result = await this.logServiceClient.getActiveLogKey();

		return {
			logKeyId:  result.logKeyId,
			publicKey: result.publicKey,
		};
	}

	@handler({
		description: 'Create mobile app log',
		method:      'POST',
		path:        '/logs/file',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.LOG,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				logKeyId: joi.string().required(),
				data:     joi.string().required(),
				date:     joi.date().allow(null),
				info:     joi.string().allow(null),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					publicFileId: joi.string().required(),
				}),
			}),
		},
	})
	public async createMobileAppLog (req: RequestObj): Promise<object> {
		const result = await this.logServiceClient.createMobileAppLog({
			logKeyId:       req.body.logKeyId,
			data:           req.body.data,
			counterpartyId: req.auth.counterpartyId!,
			date:           req.body.date,
			info:           req.body.info || null,
		});

		return {
			publicFileId: result.publicFileId,
		};
	}

	@handler({
		description: 'Create unauthorized mobile app log',
		method:      'POST',
		path:        '/logs/unauthorized/file/',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.LOG,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				logKeyId: joi.string().required(),
				data:     joi.string().required(),
				info:     joi.string().allow(null),
				date:     joi.date().allow(null),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					publicFileId: joi.string().required(),
				}),
			}),
		},
	})
	public async createUnauthorizedMobileAppLog (req: RequestObj): Promise<object> {
		const result = await this.logServiceClient.createUnauthorizedMobileAppLog({
			logKeyId: req.body.logKeyId,
			data:     req.body.data,
			info:     req.body.info || null,
			date:     req.body.date,
		});

		return {
			publicFileId: result.publicFileId,
		};
	}
}
