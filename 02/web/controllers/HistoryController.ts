import {HistoryServiceClient} from 'rpc/lib/HistoryServiceClient';
import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';


export class HistoryController {

	constructor (
		private historyServiceClient: HistoryServiceClient,
	) {}

	@handler({
		description: 'List history operations (use only for special requests)',
		method:      'GET',
		path:        '/history/operations',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.HISTORY,
			action:   AuditAction.getListOfSpecialOperations,
		},
		validate: {
			query: joi.object().keys({
				limit: joi.number().integer(),
				skip:  joi.number().integer(),
				sort:  joi.array().items(
					joi.object({
						field: joi.string().required(),
						order: joi.string(),
					}),
				),
				filter: joi.object().keys({
					sourceType: joi.string(),
					createdAt:  joi.object().keys({
						from: joi.date(),
						till: joi.date(),
					}),
					date: joi.object().keys({
						from: joi.date(),
						till: joi.date(),
					}),
					onlyForeignCurrency: joi.boolean(), // тільки операції в іноземній валюті.
					transactionType:     joi.string(),
					cardSource:          joi.string(),
				}),
				addOperationsByPeriod: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:             joi.string().required(),
							counterpartyId: joi.string().required(),
							type:           joi.string().required(),
							title:          joi.string().required(),
							description:    joi.string().required(),
							data:           joi.object(),
							isRead:         joi.boolean().required(),
							date:           joi.date().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listHistoryOperations (req: RequestObj): Promise<object> {
		const history = await this.historyServiceClient.listHistoryOperations({
			counterpartyId:        req.auth.counterpartyId!,
			lg:                    req.auth.lg!,
			limit:                 req.query.limit,
			skip:                  req.query.skip,
			sort:                  req.query.sort,
			filter:                req.query.filter,
			addOperationsByPeriod: req.query.addOperationsByPeriod,
		});

		return {
			total: history.total,
			items: history.items.map((historyItem) => {
				return {
					id:             historyItem.id,
					counterpartyId: historyItem.counterpartyId,
					type:           historyItem.type,
					title:          historyItem.title,
					description:    historyItem.description,
					data:           historyItem.data,
					isRead:         historyItem.isRead,
					date:           historyItem.date,
				};
			}),
		};
	}

	@handler({
		description: 'List history operations for lists in budget',
		method:      'GET',
		path:        '/history/budget/analytic/operations',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.HISTORY,
			action:   AuditAction.getListOfSpecialOperations,
		},
		validate: {
			query: joi.object().keys({
				limit: joi.number().integer(),
				skip:  joi.number().integer(),
				sort:  joi.array().items(
					joi.object({
						field: joi.string().required(),
						order: joi.string(),
					}),
				),
				filter: joi.object().keys({
					sourceType: joi.string(),
					createdAt:  joi.object().keys({
						from: joi.date(),
						till: joi.date(),
					}),
					date: joi.object().keys({
						from: joi.date(),
						till: joi.date(),
					}),
					onlyForeignCurrency:          joi.boolean(), // тільки операції в іноземній валюті.
					transactionType:              joi.string(),
					cardSource:                   joi.string(),
					transactionCategories:        joi.array().items(joi.string()),
					categories:                   joi.array().items(joi.string()),
					excludeTransactionCategories: joi.array().items(joi.string()),
					excludeCategories:            joi.array().items(joi.string()),
					cardsCurrencies:              joi.array().items(joi.string()),
				}),
				addOperationsByPeriod: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:             joi.string().required(),
							counterpartyId: joi.string().required(),
							type:           joi.string().required(),
							title:          joi.string().required(),
							description:    joi.string().required(),
							data:           joi.object(),
							isRead:         joi.boolean().required(),
							date:           joi.date().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listHistoryAnalyticOperations (req: RequestObj): Promise<object> {
		let filter = req.query.filter;
		if (filter) {
			filter.cardsCurrencies = filter?.cardsCurrencies || ['UAH']; // Аналітика тільки для гривневих карт.
		} else {
			filter = {
				cardsCurrencies: ['UAH'],
			};
		}

		const history = await this.historyServiceClient.listHistoryOperations({
			counterpartyId:        req.auth.counterpartyId!,
			lg:                    req.auth.lg!,
			limit:                 req.query.limit,
			skip:                  req.query.skip,
			sort:                  req.query.sort,
			filter:                filter,
			addOperationsByPeriod: req.query.addOperationsByPeriod,
		});

		return {
			total: history.total,
			items: history.items.map((historyItem) => {
				return {
					id:             historyItem.id,
					counterpartyId: historyItem.counterpartyId,
					type:           historyItem.type,
					title:          historyItem.title,
					description:    historyItem.description,
					data:           historyItem.data,
					isRead:         historyItem.isRead,
					date:           historyItem.date,
				};
			}),
		};
	}

	@handler({
		description: 'List history items',
		method:      'GET',
		path:        '/history/items',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.HISTORY,
			action:   AuditAction.getListOfHistoryItems,
		},
		cacheHeaders: {
			xHistoryChangesId: true,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					text:            joi.string(),
					types:           joi.array().items(joi.string().valid('MESSAGE', 'OPERATION')),
					transactionType: joi.string().valid('CREDIT', 'DEBIT'),
					cardIds:         joi.array().items(joi.string()),
					category:        joi.string(),
					categories:      joi.array().items(joi.string()),
					statuses:        joi.array().items(joi.string()),
					date:            joi.object().keys({
						from: joi.date(),
						till: joi.date(),
					}),
				}),
				lastDate: joi.date().iso().raw(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:          joi.string().required(),
							type:        joi.string().required(),
							title:       joi.string().required(),
							description: joi.string().required(),
							data:        joi.object(),
							isRead:      joi.boolean().required(),
							date:        joi.date().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listHistoryItems (req: RequestObj): Promise<object> {
		// конвертуємо lastDate у date.till
		const date = {
			from: req.query.filter?.date?.from,
			till: req.query.filter?.date?.till ? req.query.filter?.date?.till : req.query.lastDate,
		};
		const history = await this.historyServiceClient.listHistoryItems({
			counterpartyId: req.auth.counterpartyId!,
			filter:         {
				...req.query.filter,
				date: date,
			},
			lg: req.auth.lg!,
		});

		return {
			total: history.total,
			items: history.items.map((historyItem) => {
				return {
					id:          historyItem.id,
					type:        historyItem.type,
					title:       historyItem.title,
					description: historyItem.description,
					data:        historyItem.data,
					isRead:      historyItem.isRead,
					date:        historyItem.date,
				};
			}),
		};
	}

	@handler({
		description: 'List history condition states',
		method:      'GET',
		path:        '/history/condition-states',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.HISTORY,
			action:   AuditAction.getListOfConditionStates,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:             joi.string().required(),
							counterpartyId: joi.string().required(),
							type:           joi.string().required(),
							title:          joi.string(),
							description:    joi.string(),
							data:           joi.string(),
							isRead:         joi.boolean().required(),
							date:           joi.date(),
						}),
					),
				}),
			}),
		},
	})
	public async listHistoryConditionStates (req: RequestObj): Promise<object> {
		const history = await this.historyServiceClient.listConditionStates({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
		});

		return {
			total: history.total,
			items: history.items.map((historyItem) => {
				return {
					id:             historyItem.id,
					counterpartyId: historyItem.counterpartyId,
					type:           historyItem.type,
					title:          historyItem.title,
					description:    historyItem.description,
					data:           historyItem.data,
					isRead:         historyItem.isRead,
					date:           historyItem.date,
				};
			}),
		};
	}

	@handler({
		description: 'List history items for user',
		method:      'GET',
		path:        '/history/user/items',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.HISTORY,
			action:   AuditAction.getListOfHistoryItems,
		},
		cacheHeaders: {
			xHistoryChangesId: true,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					text:       joi.string(),
					types:      joi.array().items(joi.string().valid('MESSAGE', 'OPERATION')),
					cardIds:    joi.array().items(joi.string()),
					categories: joi.array().items(joi.string()),
					statuses:   joi.array().items(joi.string()),
					date:       joi.object().keys({
						from: joi.date(),
						till: joi.date(),
					}),
				}),
				lastDate: joi.date().iso().raw(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:          joi.string().required(),
							type:        joi.string().required(),
							title:       joi.string().required(),
							description: joi.string().required(),
							data:        joi.string(),
							isRead:      joi.boolean().required(),
							date:        joi.date().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listUserHistoryItems (req: RequestObj): Promise<object> {
		// конвертуємо lastDate у date.till
		const date = {
			from: req.query.filter?.date?.from,
			till: req.query.filter?.date?.till ? req.query.filter?.date?.till : req.query.lastDate,
		};
		const history = await this.historyServiceClient.listUserHistoryItems({
			counterpartyId: req.auth.counterpartyId!,
			filter:         {
				...req.query.filter,
				date: date,
			},
			lg: req.auth.lg!,
		});

		return {
			total: history.total,
			items: history.items.map((historyItem) => {
				return {
					id:          historyItem.id,
					type:        historyItem.type,
					title:       historyItem.title,
					description: historyItem.description,
					data:        historyItem.data,
					isRead:      historyItem.isRead,
					date:        historyItem.date,
				};
			}),
		};
	}

	@handler({
		description: 'List history filters',
		method:      'GET',
		path:        '/history/filters',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.HISTORY,
			action:   AuditAction.getListOfHistoryFilters,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					operations: joi.object().keys({
						statuses: joi.array().items(
							joi.object().keys({
								title:  joi.string().required(),
								value:  joi.string().required(),
								iconId: joi.string().required(),
							}),
						),
						incoming: joi.array().items(
							joi.object().keys({
								title:  joi.string().required(),
								value:  joi.string().required(),
								iconId: joi.string().required(),
							}),
						),
						outgoing: joi.array().items(
							joi.object().keys({
								title:  joi.string().required(),
								value:  joi.string().required(),
								iconId: joi.string().required(),
							}),
						),
					}),
				}),
			}),
		},
	})
	public async listHistoryFiltersItems (req: RequestObj): Promise<object> {
		const historyFilters = await this.historyServiceClient.listHistoryFiltersItems({
			lg: req.auth.lg!,
		});

		return {
			operations: {
				statuses: historyFilters.operations.statuses.map((historyFilter) => {
					return {
						title:  historyFilter.title,
						value:  historyFilter.value,
						iconId: historyFilter.iconId,
					};
				}),
				incoming: historyFilters.operations.incoming.map((historyFilter) => {
					return {
						title:  historyFilter.title,
						value:  historyFilter.value,
						iconId: historyFilter.iconId,
					};
				}),
				outgoing: historyFilters.operations.outgoing.map((historyFilter) => {
					return {
						title:  historyFilter.title,
						value:  historyFilter.value,
						iconId: historyFilter.iconId,
					};
				}),
			},
		};
	}
}
