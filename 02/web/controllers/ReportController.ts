import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {ReportServiceClient} from 'rpc/lib/ReportServiceClient';


export class ReportController {

	constructor (
		private reportServiceClient: ReportServiceClient,
	) {}

	@handler({
		description: 'Create request for an account statement',
		method:      'POST',
		path:        '/reports/account-statement',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REPORT,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				cardId:    joi.string().guid().required(),
				email:     joi.string().trim().email({tlds: false}).required(),
				fileType:  joi.string().required(),
				startDate: joi.string().onlyDateString().required(),
				endDate:   joi.string().onlyDateString().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					reportId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createRequestAccountStatement (req: RequestObj): Promise<object> {
		const report = await this.reportServiceClient.createRequestAccountStatement({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.body.cardId,
			email:          req.body.email,
			fileType:       req.body.fileType,
			startDate:      req.body.startDate,
			endDate:        req.body.endDate,
		});

		return {
			reportId: report.id,
		};
	}

	@handler({
		description: 'Create request for an interest on balance',
		method:      'POST',
		path:        '/reports/interest-on-balance',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REPORT,
			action:   AuditAction.create,
		},
		validate: {
			body: {
				cardId:    joi.string().guid().required(),
				email:     joi.string().trim().email({tlds: false}),
				fileType:  joi.string().required(),
				startDate: joi.string().onlyDateString().required(),
				endDate:   joi.string().onlyDateString().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					reportId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async createRequestAccountInterestOnBalance (req: RequestObj): Promise<object> {
		const report = await this.reportServiceClient.createRequestAccountInterestOnBalance({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.body.cardId,
			email:          req.body.email,
			fileType:       req.body.fileType,
			startDate:      req.body.startDate,
			endDate:        req.body.endDate,
		});

		return {
			reportId: report.id,
		};
	}

	@handler({
		description: 'Get accession contart text for virtual contract',
		method:      'GET',
		path:        '/contracts/template/:applicationId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.REPORT,
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
					template: joi.object().required(),
				}),
			}),
		},
	})
	public async showAccessionContractTemplate (req: RequestObj): Promise<object> {
		const templateContract = await this.reportServiceClient.showContractTextMobileView({
			counterpartyId: req.auth.counterpartyId!,
			applicationId:  req.params.applicationId,
		});

		return {
			template: templateContract.template,
		};
	}


	@handler({
		description: 'Get close account info result',
		method:      'GET',
		path:        '/contracts/:cardId/close-info',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.REPORT,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					template:   joi.object().required(),
					errorCodes: joi.array().items(joi.string()),
				}),
			}),
		},
	})
	public async showCloseAccountInfoMobileView (req: RequestObj): Promise<object> {
		const templateContract = await this.reportServiceClient.showCloseAccountInfoMobileView({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
		});

		return {
			template:   templateContract.template,
			errorCodes: templateContract.errorCodes,
		};
	}
}
