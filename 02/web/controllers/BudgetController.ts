import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {AnalyticServiceClient} from 'rpc/lib/AnalyticServiceClient';


export class BudgetController {

	constructor (
		private analyticServiceClient: AnalyticServiceClient,
	) {}

	@handler({
		description: 'Show data for budget chart for one month',
		method:      'GET',
		path:        '/budget/expenses/grouped/dates',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					category: joi.string(),
					period:   joi.date().required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					expenses: joi.array().items(
						joi.object().keys({
							date:   joi.date().required(),
							amount: joi.number().integer().required(),
						}),
					),
				}),
			}),
		},
	})
	public async showExpensesForChartByMonth (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showExpensesForChartByMonth({
			counterpartyId: req.auth.counterpartyId!,
			period:         req.query.filter.period,
			category:       req.query.filter.category,
		});

		return {
			expenses: result.expenses.map((item) => {
				return {
					date:   item.date,
					amount: item.amount,
				};
			}),
		};
	}

	@handler({
		description: 'Show data for budget chart by period. Data grouped by month. Inside one month grouped by date',
		method:      'GET',
		path:        '/budget/expenses/grouped/months',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					from: joi.date().required(),
					till: joi.date().required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					expenses: joi.array().items(
						joi.array().items(
							joi.object().keys({
								date:   joi.date().required(),
								amount: joi.number().integer().required(),
							}),
						),
					),
				}),
			}),
		},
	})
	public async showExpensesForChartByPeriod (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showExpensesForChartByPeriod({
			counterpartyId: req.auth.counterpartyId!,
			from:           req.query.filter.from,
			till:           req.query.filter.till,
		});

		return {
			expenses: result.expenses.map((item) => {
				return item.map((element) => {
					return {
						date:   element.date,
						amount: element.amount,
					};
				});
			}),
		};
	}

	@handler({
		description: 'Show data for expenses per categories',
		method:      'GET',
		path:        '/budget/expenses/grouped/categories',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					period:                  joi.date().required(),
					categoriesWithoutLimits: joi.boolean(),
					categoriesWithLimits:    joi.boolean(),
					categoriesWithExpenses:  joi.boolean(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					expenses: joi.array().items(
						joi.object().keys({
							category:      joi.string().required(),
							categoryTitle: joi.string().required(),
							iconId:        joi.string().required(),
							amountLimit:   joi.number().integer().positive().allow(null).required(),
							amountUsed:    joi.number().integer().required(),
						}),
					),
				}),
			}),
		},
	})
	public async showExpensesPerCategoriesByMonth (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showExpensesPerCategoriesByMonth({
			counterpartyId:          req.auth.counterpartyId!,
			lg:                      req.auth.lg!,
			period:                  req.query.filter.period,
			categoriesWithoutLimits: req.query.filter.categoriesWithoutLimits,
			categoriesWithLimits:    req.query.filter.categoriesWithLimits,
			categoriesWithExpenses:  req.query.filter.categoriesWithExpenses,
		});

		return {
			expenses: result.expenses.map((item) => {
				return {
					category:      item.category,
					categoryTitle: item.categoryTitle,
					iconId:        item.iconId,
					amountLimit:   item.amountLimit,
					amountUsed:    item.amountUsed,
				};
			}),
		};
	}

	@handler({
		description: 'Show total expenses per category by month',
		method:      'GET',
		path:        '/budget/expenses/categories/:category',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				category: joi.string().required(),
			}),
			query: joi.object().keys({
				filter: joi.object().keys({
					period: joi.date().required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					category:      joi.string().required(),
					categoryTitle: joi.string().required(),
					iconId:        joi.string().required(),
					amountLimit:   joi.number().integer().positive().allow(null).required(),
					amountUsed:    joi.number().integer().required(),
				}),
			}),
		},
	})
	public async showExpensesPerCategoryByMonth (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showExpensesPerCategoryByMonth({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			category:       req.params.category,
			period:         req.query.filter.period,
		});

		return {
			category:      result.category,
			categoryTitle: result.categoryTitle,
			iconId:        result.iconId,
			amountLimit:   result.amountLimit,
			amountUsed:    result.amountUsed,
		};
	}

	@handler({
		description: 'Show total expenses by month',
		method:      'GET',
		path:        '/budget/expenses/total',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					period: joi.date().required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					amount: joi.number().required(),
				}),
			}),
		},
	})
	public async showTotalExpensesAmountByMonth (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showTotalExpensesAmountByMonth({
			counterpartyId: req.auth.counterpartyId!,
			period:         req.query.filter.period,
		});

		return {
			amount: result.amount,
		};
	}

	@handler({
		description: 'Set global budget limit',
		method:      'PATCH',
		path:        '/budget/limits/global',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.setBudgetLimit,
		},
		validate: {
			body: joi.object().keys({
				amountLimit: joi.number().integer().allow(null).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					success: joi.boolean().required(),
				}),
			}),
		},
	})
	public async setGlobalBudgetLimit (req: RequestObj): Promise<object> {
		await this.analyticServiceClient.setGlobalBudgetLimit({
			counterpartyId: req.auth.counterpartyId!,
			amountLimit:    req.body.amountLimit,
		});

		return {
			success: true,
		};
	}

	@handler({
		description: 'Set budget limits for categories',
		method:      'PATCH',
		path:        '/budget/limits/categories',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.setBudgetLimit,
		},
		validate: {
			body: joi.object().keys({
				limits: joi.array().items(
					joi.object().keys({
						category:    joi.string().required(),
						amountLimit: joi.number().integer().positive().allow(null).required(),
					}),
				),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					success: joi.boolean().required(),
				}),
			}),
		},
	})
	public async setBudgetLimitsForCategories (req: RequestObj): Promise<object> {
		await this.analyticServiceClient.setBudgetLimitsForCategories({
			counterpartyId: req.auth.counterpartyId!,
			limits:         req.body.limits,
		});

		return {
			success: true,
		};
	}

	@handler({
		description: 'Change budget status',
		method:      'PATCH',
		path:        '/budget/status',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.setBudgetStatus,
		},
		validate: {
			body: joi.object().keys({
				status: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					status: joi.string().required(),
				}),
			}),
		},
	})
	public async changeBudgetStatus (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.changeBudgetStatus({
			counterpartyId: req.auth.counterpartyId!,
			status:         req.body.status,
		});

		return {
			status: result.status,
		};
	}

	@handler({
		description: 'List operations by budget category for expenses',
		method:      'GET',
		path:        '/budget/expenses/categories/:category/operations',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getList,
		},
		validate: {
			params: joi.object().keys({
				category: joi.string().required(),
			}),
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
					date: joi.object().keys({
						from: joi.date().required(),
						till: joi.date(),
					}).required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:                     joi.string().required(),
					counterpartyId:         joi.string().allow(null).required(),
					cardId:                 joi.string().allow(null).required(),
					cardToId:               joi.string().allow(null).required(),
					cardFromId:             joi.string().allow(null).required(),
					status:                 joi.string().required(),
					amount:                 joi.number().required(),
					fee:                    joi.number().required(),
					totalAmount:            joi.number().required(),
					currency:               joi.string().required(),
					contactId:              joi.string().allow(null).required(),
					phoneBookContactId:     joi.string().allow(null).required(),
					phoneBookContactFromId: joi.string().allow(null).required(),
					panMasked:              joi.string().allow(null).required(),
					panFromMasked:          joi.string().allow(null).required(),
					panToMasked:            joi.string().allow(null).required(),
					transactionId:          joi.string().allow(null).required(),
					allowedActions:         joi.array().items(joi.string()),
					createdAt:              joi.date().allow(null).required(),
					availableBalance:       joi.number().allow(null).required(),
					paymentType:            joi.string().allow(null).required(),
					date:                   joi.date().allow(null).required(),
					transactionType:        joi.string().required(),
					title:                  joi.string().allow(null).required(),
					category:               joi.string().required(),
					categoryTitle:          joi.string().allow(null).required(),
					isReturnType:           joi.boolean().required(),
					terminalOwner:          joi.string().allow(null).required(),
					cashbackAmount:         joi.number().allow(null).required(),
					transactionTotalAmount: joi.number().allow(null).required(),
					transactionFee:         joi.number().allow(null).required(),
					transactionCurrency:    joi.string().allow(null).required(),
					exchangeRate:           joi.string().allow(null).required(),
					purposeOfPayment:       joi.string().allow(null).required(),
					taxId:                  joi.string().allow(null).required(),
					iban:                   joi.string().allow(null).required(),
					sourceType:             joi.string().valid('OFFLINE', 'ONLINE').required(),
					comment:                joi.string().allow(null).required(),
					terminalCategory:       joi.string().allow(null),
					avatarUrl:              joi.string().allow(null),
					errorText:              joi.string().allow(null),
					operationNumber:        joi.number().required(),
					iconId:                 joi.string().allow(null),
					fullName:               joi.string().allow(null),
					phone:                  joi.string().allow(null),
				}),
			}),
		},
	})
	public async listOperationsForExpenses (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.listOperations({
			limit:  req.query.limit,
			skip:   req.query.skip,
			sort:   req.query.sort,
			filter: {
				counterpartyId: req.auth.counterpartyId!,
				lg:             req.auth.lg!,
				type:           'EXPENSE',
				date:           {
					from: req.query.filter.date.from,
					till: req.query.filter.date.till,
				},
				categories: [req.params.category],
			},
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:                     it.id,
					counterpartyId:         it.counterpartyId,
					cardId:                 it.cardId,
					cardToId:               it.cardToId,
					cardFromId:             it.cardFromId,
					status:                 it.status,
					amount:                 it.amount,
					fee:                    it.fee,
					totalAmount:            it.totalAmount,
					currency:               it.currency,
					contactId:              it.contactId,
					phoneBookContactId:     it.phoneBookContactId,
					phoneBookContactFromId: it.phoneBookContactFromId,
					phone:                  it.phone,
					panMasked:              it.panMasked,
					panFromMasked:          it.panFromMasked,
					panToMasked:            it.panToMasked,
					transactionId:          it.transactionId,
					allowedActions:         it.allowedActions,
					createdAt:              it.createdAt,
					availableBalance:       it.availableBalance,
					paymentType:            it.paymentType,
					date:                   it.date,
					transactionType:        it.transactionType,
					title:                  it.title,
					category:               it.category,
					categoryTitle:          it.categoryTitle,
					isReturnType:           it.isReturnType,
					terminalOwner:          it.terminalOwner,
					terminalCategory:       it.terminalCategory,
					cashbackAmount:         it.cashbackAmount,
					transactionTotalAmount: it.transactionTotalAmount,
					transactionFee:         it.transactionFee,
					transactionCurrency:    it.transactionCurrency,
					exchangeRate:           it.exchangeRate,
					purposeOfPayment:       it.purposeOfPayment,
					taxId:                  it.taxId,
					iban:                   it.iban,
					sourceType:             it.sourceType,
					avatarUrl:              it.avatarUrl,
					errorText:              it.errorText,
					operationNumber:        it.operationNumber,
					comment:                it.comment,
					iconId:                 it.iconId,
					fullName:               it.fullName,
				};
			}),
		};
	}

	@handler({
		description: 'List operations by budget category for incomes',
		method:      'GET',
		path:        '/budget/incomes/categories/:category/operations',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getList,
		},
		validate: {
			params: joi.object().keys({
				category: joi.string().required(),
			}),
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
					date: joi.object().keys({
						from: joi.date().required(),
						till: joi.date(),
					}).required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:                     joi.string().required(),
					counterpartyId:         joi.string().allow(null).required(),
					cardId:                 joi.string().allow(null).required(),
					cardToId:               joi.string().allow(null).required(),
					cardFromId:             joi.string().allow(null).required(),
					status:                 joi.string().required(),
					amount:                 joi.number().required(),
					fee:                    joi.number().required(),
					totalAmount:            joi.number().required(),
					currency:               joi.string().required(),
					contactId:              joi.string().allow(null).required(),
					phoneBookContactId:     joi.string().allow(null).required(),
					phoneBookContactFromId: joi.string().allow(null).required(),
					panMasked:              joi.string().allow(null).required(),
					panFromMasked:          joi.string().allow(null).required(),
					panToMasked:            joi.string().allow(null).required(),
					transactionId:          joi.string().allow(null).required(),
					allowedActions:         joi.array().items(joi.string()),
					createdAt:              joi.date().allow(null).required(),
					availableBalance:       joi.number().allow(null).required(),
					paymentType:            joi.string().allow(null).required(),
					date:                   joi.date().allow(null).required(),
					transactionType:        joi.string().required(),
					title:                  joi.string().allow(null).required(),
					category:               joi.string().required(),
					categoryTitle:          joi.string().allow(null).required(),
					isReturnType:           joi.boolean().required(),
					terminalOwner:          joi.string().allow(null).required(),
					cashbackAmount:         joi.number().allow(null).required(),
					transactionTotalAmount: joi.number().allow(null).required(),
					transactionFee:         joi.number().allow(null).required(),
					transactionCurrency:    joi.string().allow(null).required(),
					exchangeRate:           joi.string().allow(null).required(),
					purposeOfPayment:       joi.string().allow(null).required(),
					taxId:                  joi.string().allow(null).required(),
					iban:                   joi.string().allow(null).required(),
					sourceType:             joi.string().valid('OFFLINE', 'ONLINE').required(),
					comment:                joi.string().allow(null).required(),
					terminalCategory:       joi.string().allow(null),
					avatarUrl:              joi.string().allow(null),
					errorText:              joi.string().allow(null),
					operationNumber:        joi.number().required(),
					iconId:                 joi.string().allow(null),
					fullName:               joi.string().allow(null),
					phone:                  joi.string().allow(null),
				}),
			}),
		},
	})
	public async listOperationsForIncomes (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.listOperations({
			limit:  req.query.limit,
			skip:   req.query.skip,
			sort:   req.query.sort,
			filter: {
				counterpartyId: req.auth.counterpartyId!,
				lg:             req.auth.lg!,
				type:           'INCOME',
				date:           {
					from: req.query.filter.date.from,
					till: req.query.filter.date.till,
				},
				categories: [req.params.category],
			},
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:                     it.id,
					counterpartyId:         it.counterpartyId,
					cardId:                 it.cardId,
					cardToId:               it.cardToId,
					cardFromId:             it.cardFromId,
					status:                 it.status,
					amount:                 it.amount,
					fee:                    it.fee,
					totalAmount:            it.totalAmount,
					currency:               it.currency,
					contactId:              it.contactId,
					phoneBookContactId:     it.phoneBookContactId,
					phoneBookContactFromId: it.phoneBookContactFromId,
					phone:                  it.phone,
					panMasked:              it.panMasked,
					panFromMasked:          it.panFromMasked,
					panToMasked:            it.panToMasked,
					transactionId:          it.transactionId,
					allowedActions:         it.allowedActions,
					createdAt:              it.createdAt,
					availableBalance:       it.availableBalance,
					paymentType:            it.paymentType,
					date:                   it.date,
					transactionType:        it.transactionType,
					title:                  it.title,
					category:               it.category,
					categoryTitle:          it.categoryTitle,
					isReturnType:           it.isReturnType,
					terminalOwner:          it.terminalOwner,
					terminalCategory:       it.terminalCategory,
					cashbackAmount:         it.cashbackAmount,
					transactionTotalAmount: it.transactionTotalAmount,
					transactionFee:         it.transactionFee,
					transactionCurrency:    it.transactionCurrency,
					exchangeRate:           it.exchangeRate,
					purposeOfPayment:       it.purposeOfPayment,
					taxId:                  it.taxId,
					iban:                   it.iban,
					sourceType:             it.sourceType,
					avatarUrl:              it.avatarUrl,
					errorText:              it.errorText,
					operationNumber:        it.operationNumber,
					comment:                it.comment,
					iconId:                 it.iconId,
					fullName:               it.fullName,
				};
			}),
		};
	}

	@handler({
		description: 'Show data for limits by categories',
		method:      'GET',
		path:        '/budget/limits/categories',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getList,
		},
		validate: {
			query: joi.object().keys({
				onlyWithoutExpenses:     joi.boolean(),
				onlyWithoutActiveLimits: joi.boolean(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					categories: joi.array().items(
						joi.object().keys({
							category:          joi.string().required(),
							categoryTitle:     joi.string().required(),
							iconId:            joi.string().required(),
							amountLimit:       joi.number().integer().positive().allow(null).required(),
							amountAvgPerMonth: joi.number().integer().required(),
						}),
					),
				}),
			}),
		},
	})
	public async showLimitsPerCategoriesWithAvgExpenses (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showLimitsPerCategoriesWithAvgExpenses({
			counterpartyId:          req.auth.counterpartyId!,
			lg:                      req.auth.lg!,
			onlyWithoutExpenses:     req.query.onlyWithoutExpenses,
			onlyWithoutActiveLimits: req.query.onlyWithoutActiveLimits,
		});

		return {
			categories: result.categories.map((item) => {
				return {
					category:          item.category,
					categoryTitle:     item.categoryTitle,
					iconId:            item.iconId,
					amountLimit:       item.amountLimit,
					amountAvgPerMonth: item.amountAvgPerMonth,
				};
			}),
		};
	}

	@handler({
		description: 'Show data about global budget and additional info',
		method:      'GET',
		path:        '/budget/limits/global',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					period: joi.date(),
				}),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					status:                     joi.string().required(),
					amountUsed:                 joi.number().integer().required(),
					amountLimit:                joi.number().integer().positive().allow(null).required(),
					amountLimitByAllCategories: joi.number().integer().positive().allow(null).required(),
					warningPercents:            joi.number().required(),
				}),
			}),
		},
	})
	public async showGeneralBudgetData (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showGeneralBudgetData({
			counterpartyId: req.auth.counterpartyId!,
			period:         req.query?.filter?.period,
		});

		return {
			status:                     result.status,
			amountUsed:                 result.amountUsed,
			amountLimit:                result.amountLimit,
			amountLimitByAllCategories: result.amountLimitByAllCategories,
			warningPercents:            result.warningPercents,
		};
	}

	@handler({
		description: 'Show analytic chart data',
		method:      'GET',
		path:        '/budget/analytic/chart',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getAnalyticData,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					groupingType: joi.string().required(),
					date:         joi.object().keys({
						from: joi.date().required(),
						till: joi.date().required(),
					}).required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					periods: joi.array().items(joi.object().keys({
						from:           joi.date().required(),
						till:           joi.date().required(),
						expensesAmount: joi.number().required(),
						incomesAmount:  joi.number().required(),
					})),
				}),
			}),
		},
	})
	public async showAnalyticChartData (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showAnalyticChartData({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			groupingType:   req.query.filter.groupingType,
			date:           {
				from: req.query.filter.date.from,
				till: req.query.filter.date.till,
			},
		});

		return {
			periods: result.periods,
		};
	}

	@handler({
		description: 'Show general analytic data',
		method:      'GET',
		path:        '/budget/analytic/general',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getAnalyticData,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					date: joi.object().keys({
						from: joi.date().required(),
						till: joi.date().required(),
					}).required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					expensesTotalAmount:        joi.number().required(),
					incomesTotalAmount:         joi.number().required(),
					expensesCategoriesPercents: joi.object().keys({
						categories: joi.array().items(joi.object().keys({
							category: joi.string().required(),
							percent:  joi.number().required(),
						})),
						otherCategories: joi.number().required(),
					}).required(),
					incomesCategoriesPercents: joi.object().keys({
						categories: joi.array().items(joi.object().keys({
							category: joi.string().required(),
							percent:  joi.number().required(),
						})),
						otherCategories: joi.number().required(),
					}).required(),
					interestingData: joi.array().items(
						joi.object().keys({
							type:                  joi.string().required(),
							iconId:                joi.string().required(),
							categoryTitle:         joi.string(),
							terminalCategoryTitle: joi.string(),
							totalAmount:           joi.number(),
							date:                  joi.date().allow(null),
							operationsNumber:      joi.number(),
							avgAmount:             joi.number(),
							cashFlow:              joi.number(),
							percent:               joi.number(),
						}),
					).required(),
					interestingDataArrays: joi.array().items(
						joi.array().items(
							joi.object().keys({
								type:                  joi.string().required(),
								iconId:                joi.string().required(),
								categoryTitle:         joi.string(),
								terminalCategoryTitle: joi.string(),
								totalAmount:           joi.number(),
								date:                  joi.date().allow(null),
								operationsNumber:      joi.number(),
								avgAmount:             joi.number(),
								cashFlow:              joi.number(),
								percent:               joi.number(),
							}),
						),
					).required(),
				}),
			}),
		},
	})
	public async showAnalyticGeneralData (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showAnalyticGeneralData({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			date:           {
				from: req.query.filter.date.from,
				till: req.query.filter.date.till,
			},
		});

		return {
			incomesTotalAmount:         result.incomesTotalAmount,
			expensesTotalAmount:        result.expensesTotalAmount,
			incomesCategoriesPercents:  result.incomesCategoriesPercents,
			expensesCategoriesPercents: result.expensesCategoriesPercents,
			interestingDataArrays:      result.interestingDataArrays,
		};
	}

	@handler({
		description: 'Show detailed expenses for analytic',
		method:      'GET',
		path:        '/budget/analytic/details/expenses',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getAnalyticExpenses,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					date: joi.object().keys({
						from: joi.date().required(),
						till: joi.date().required(),
					}).required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					categories: joi.array().items(joi.object().keys({
						category:              joi.string().required(),
						categoryTitle:         joi.string().required(),
						iconId:                joi.string().required(),
						totalAmount:           joi.number().required(),
						totalOperationsNumber: joi.number().required(),
						percent:               joi.number().required(),
					})),
				}),
			}),
		},
	})
	public async showDetailedExpenses (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showDetailsForAnalytic({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			type:           'EXPENSE',
			date:           {
				from: req.query.filter.date.from,
				till: req.query.filter.date.till,
			},
		});

		return {
			categories: result.categories.map((item) => {
				return {
					category:              item.category,
					categoryTitle:         item.categoryTitle,
					iconId:                item.iconId,
					totalAmount:           item.totalAmount,
					totalOperationsNumber: item.totalOperationsNumber,
					percent:               item.percent,
				};
			}),
		};
	}

	@handler({
		description: 'Show detailed incomes for analytic',
		method:      'GET',
		path:        '/budget/analytic/details/incomes',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BUDGET,
			action:   AuditAction.getAnalyticIncomes,
		},
		validate: {
			query: joi.object().keys({
				filter: joi.object().keys({
					date: joi.object().keys({
						from: joi.date().required(),
						till: joi.date().required(),
					}).required(),
				}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					categories: joi.array().items(joi.object().keys({
						category:              joi.string().required(),
						categoryTitle:         joi.string().required(),
						iconId:                joi.string().required(),
						totalAmount:           joi.number().required(),
						totalOperationsNumber: joi.number().required(),
						percent:               joi.number().required(),
					})),
				}),
			}),
		},
	})
	public async showDetailedIncomes (req: RequestObj): Promise<object> {
		const result = await this.analyticServiceClient.showDetailsForAnalytic({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			type:           'INCOME',
			date:           {
				from: req.query.filter.date.from,
				till: req.query.filter.date.till,
			},
		});

		return {
			categories: result.categories.map((item) => {
				return {
					category:              item.category,
					categoryTitle:         item.categoryTitle,
					iconId:                item.iconId,
					totalAmount:           item.totalAmount,
					totalOperationsNumber: item.totalOperationsNumber,
					percent:               item.percent,
				};
			}),
		};
	}
}
