import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {StaticDataServiceClient} from 'rpc/lib/StaticDataServiceClient';
import {WebError} from 'app/lib/interfaces/web/WebError';


export class StaticDataController {

	constructor (
		private staticDataServiceClient: StaticDataServiceClient,
	) {}

	@handler({
		description: 'List templates',
		method:      'GET',
		path:        '/statics/templates',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.STATIC_DATA,
			action:   AuditAction.getListOfTemplates,
		},
		validate: {
			query: joi.object().keys({
				limit: joi.number().integer().min(1).max(100),
				skip:  joi.number().integer().min(0).max(1000),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().integer().min(0).max(100),
					items: joi.array().items(
						joi.object().keys({
							id:        joi.string().guid().required(),
							name:      joi.string(),
							data:      joi.string(),
							order:     joi.number().integer().positive().required(),
							createdAt: joi.date().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listTemplate (req: RequestObj): Promise<object> {
		if (req.query.sort) {
			try {
				req.query.sort = JSON.parse(req.query.sort);
			} catch (err: any) {
				throw new WebError(400, 'VALIDATION ERROR', 'Request validation failed in query', {
					in:     'query',
					errors: [{
						message: '"sort" must be a valid JSON string',
						key:     'sort',
						value:   req.query.sort,
					}],
				});
			}
		}
		const result = await this.staticDataServiceClient.listTemplate(req.query);

		return {
			total: result.total,
			items: result.items.map((item: any) => {
				return {
					id:        item.id,
					name:      item.name,
					data:      item.data,
					order:     item.order,
					createdAt: item.createdAt,
				};
			}),
		};
	}

	@handler({
		description: 'General Data',
		method:      'GET',
		path:        '/statics/data/:id',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.STATIC_DATA,
			action:   AuditAction.getGeneral,
		},
		validate: {
			params: {
				id: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:     joi.string().required(),
					json:   joi.string().required(),
					status: joi.string().required(),
				}),
			}),
		},
	})
	public async showGeneralData (req: RequestObj): Promise<object> {
		const result = await this.staticDataServiceClient.showGeneralData({
			generalDataId: req.params.id,
		});

		return {
			id:     result.id,
			json:   result.json,
			status: result.status,
		};
	}

	/* Card Styles */
	@handler({
		description: 'List card styles',
		method:      'GET',
		path:        '/statics/card-styles',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.STATIC_DATA,
			action:   AuditAction.getListOfStyles,
		},
		validate: {
			query: joi.object().keys({
				limit: joi.number().integer().min(1).max(100),
				skip:  joi.number().integer().min(0).max(1000),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().integer().min(0).max(100),
					items: joi.array().items(
						joi.object().keys({
							id:     joi.string().required(),
							data:   joi.string().required(),
							status: joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listCardStyles (req: RequestObj): Promise<object> {
		const result = await this.staticDataServiceClient.listCardStyles(req.query);

		return {
			total: result.total,
			items: result.items.map((item: any) => {
				return {
					id:     item.id,
					data:   item.data,
					status: item.status,
				};
			}),
		};
	}

	@handler({
		description: 'Get card style by id',
		method:      'GET',
		path:        '/statics/card-styles/:styleId',
		auth:        AuthType.User,
		audit:       null,
		validate:    {
			params: {
				styleId: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:     joi.string().required(),
					data:   joi.string().required(),
					status: joi.string().required(),
				}),
			}),
		},
	})
	public async showCardStyle (req: RequestObj): Promise<object> {
		const result = await this.staticDataServiceClient.showCardStyle({
			cardStyleId: req.params.styleId,
		});

		return {
			id:     result.id,
			data:   result.data,
			status: result.status,
		};
	}

	@handler({
		description: 'List icons',
		method:      'GET',
		path:        '/statics/icons',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.STATIC_DATA,
			action:   AuditAction.getListOfIcons,
		},
		validate: {
			query: joi.object().keys({
				limit: joi.number().integer().min(1).max(100),
				skip:  joi.number().integer().min(0).max(1000),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().integer().min(0).max(100),
					items: joi.array().items(
						joi.object().keys({
							id:  joi.string().required(),
							url: joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listIcons (req: RequestObj): Promise<object> {
		const result = await this.staticDataServiceClient.listIcons(req.query);

		return {
			total: result.total,
			items: result.items.map((item: any) => {
				return {
					id:  item.id,
					url: item.url,
				};
			}),
		};
	}

	@handler({
		description: 'Get icon by id',
		method:      'GET',
		path:        '/statics/icons/:iconId',
		auth:        AuthType.User,
		audit:       null,
		validate:    {
			params: {
				iconId: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:  joi.string().required(),
					url: joi.string().required(),
				}),
			}),
		},
	})
	public async showIcon (req: RequestObj): Promise<object> {
		const result = await this.staticDataServiceClient.showIcon({
			iconId: req.params.iconId,
		});

		return {
			id:  result.id,
			url: result.url,
		};
	}
}
