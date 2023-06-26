import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';
import {AppServiceClient} from 'rpc/lib/AppServiceClient';
import {AuthType} from '../auth/auth.types';


export class AppController {

	constructor (
		private appServiceClient: AppServiceClient,
	) {}

	@handler({
		description: 'Create installation',
		method:      'POST',
		path:        '/apps/installations',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.INSTALLATION,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				appVersion:    joi.string().required(),
				deviceId:      joi.string().required(),
				deviceInfo:    joi.object(),
				referrerAlias: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					installationId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createInstallation (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.createInstallation({
			appVersion:    req.body.appVersion,
			deviceId:      req.body.deviceId,
			deviceInfo:    req.body.deviceInfo,
			referrerAlias: req.body.referrerAlias,
		});

		return {
			installationId: installation.installationId,
		};
	}

	@handler({
		description: 'Update installation',
		method:      'PATCH',
		path:        '/apps/installations',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.INSTALLATION,
			action:   AuditAction.modify,
		},
		validate: {
			body: joi.object().keys({
				installationId: joi.string().guid().required(),
				deviceId:       joi.string().required(),
				appVersion:     joi.string(),
				deviceInfo:     joi.object(),
				pushToken:      joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					installationId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async updateInstallation (req: RequestObj): Promise<object> {
		const installation = await this.appServiceClient.updateInstallation({
			appVersion:     req.body.appVersion,
			deviceId:       req.body.deviceId,
			installationId: req.body.installationId,
			deviceInfo:     req.body.deviceInfo,
			pushToken:      req.body.pushToken,
		});

		return {
			installationId: installation.installationId,
		};
	}

	@handler({
		description: 'Delete installation',
		method:      'DELETE',
		path:        '/apps/devices/:deviceId/installations/:installationId',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.INSTALLATION,
			action:   AuditAction.delete,
		},
		validate: {
			params: joi.object().keys({
				installationId: joi.string().guid().required(),
				deviceId:       joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					installationId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async deleteInstallation (req: RequestObj): Promise<object> {
		await this.appServiceClient.deleteInstallation({
			installationId: req.params.installationId,
			deviceId:       req.params.deviceId,
		});

		return {
			installationId: req.params.installationId,
		};
	}

	@handler({
		description: 'Create app rate',
		method:      'POST',
		path:        '/apps/app-rate',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.APP_RATE,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				appVersion: joi.string().required(),
				rate:       joi.number().required(),
				comment:    joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					appRateId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createAppRate (req: RequestObj): Promise<object> {
		const appRate = await this.appServiceClient.createAppRate({
			userId:     req.auth.userId!,
			appVersion: req.body.appVersion,
			rate:       req.body.rate,
			comment:    req.body.comment,
		});

		return {
			appRateId: appRate.appRateId,
		};
	}
}
