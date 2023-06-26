import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';
import {BonusServiceClient} from 'rpc/lib/BonusServiceClient';
import {OperationServiceClient} from 'rpc/lib/OperationServiceClient';


export class BonusController {

	constructor (
		private bonusServiceClient: BonusServiceClient,
		private operationServiceClient: OperationServiceClient,
	) {}

	@handler({
		description: 'Show invite link for referrals',
		method:      'GET',
		path:        '/bonuses/me/invite-links',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getLinkForReferrals,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					link: joi.string().required(),
				}),
			}),
		},
	})
	public async showReferralLink (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showReferralLink({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			link: result.link,
		};
	}

	@handler({
		description: 'Show invite link for referrals',
		method:      'GET',
		path:        '/invites/:referrerAlias',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.redirectToRefferalsLink,
		},
		validate: {
			params: joi.object().keys({
				referrerAlias: joi.string().required(),
			}),
		},
		response: {
			302: joi.object(),
		},
		options: {
			redirect: true,
		},
	})
	public async showRedirectLinkForReferrer (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showRedirectLinkForReferrer({
			referrerAlias: req.params.referrerAlias,
		});

		return {
			redirectLink: result.redirectLink,
		};
	}

	@handler({
		description: 'Show referrals stats (referrals count on levels)',
		method:      'GET',
		path:        '/bonuses/me/referrals',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getRefferalsStats,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total:            joi.number().integer().positive().allow(0).required(),
					onLevelsActive:   joi.array().items(joi.number().integer().positive().allow(0)),
					onLevelsInactive: joi.array().items(joi.number().integer().positive().allow(0)),
					referrerName:     joi.string().allow(null),
				}),
			}),
		},
	})
	public async showReferralsStats (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showReferralsStats({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total:            result.total,
			onLevelsActive:   result.onLevelsActive,
			onLevelsInactive: result.onLevelsInactive,
			referrerName:     result.referrerName,
		};
	}

	@handler({
		description: 'Show cashback (account) balance',
		method:      'GET',
		path:        '/bonuses/me/cashback/balances',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackBalance,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					balanceAmount:    joi.number().integer().allow(0).required(),
					minForWithdrawal: joi.number().integer().positive().required(),
				}),
			}),
		},
	})
	public async showCashbackBalance (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showCashbackBalance({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			balanceAmount:    result.balanceAmount,
			minForWithdrawal: result.minForWithdrawal,
		};
	}

	@handler({
		description: 'Show cashback earnings (own, referral cashback by levels and total)',
		method:      'GET',
		path:        '/bonuses/me/cashback/earnings',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackEarnings,
		},
		validate: {
			query: joi.object().keys({
				from: joi.date(),
				till: joi.date(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total:    joi.number().integer().allow(0).required(),
					onLevels: joi.array().items(joi.number().integer().allow(0)).required(),
					own:      joi.number().integer().allow(0).required(),
				}),
			}),
		},
	})
	public async showCashbackEarnings (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showCashbackEarnings({
			counterpartyId: req.auth.counterpartyId!,
			from:           req.query.from,
			till:           req.query.till,
		});

		return {
			total:    result.total,
			onLevels: result.onLevels,
			own:      result.own,
		};
	}

	@handler({
		description: 'Show details for cashback withdrawal (taxes and commissions)',
		method:      'GET',
		path:        '/bonuses/cashback/commissions',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackWithdrawalDetails,
		},
		validate: {
			query: joi.object().keys({
				amount: joi.number().integer().positive().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					amountForWithdrawal: joi.number().integer().positive().required(),
					resultAmount:        joi.number().integer().positive().required(),
					taxes:               joi.array().items(joi.object().keys({
						name:        joi.string().required(),
						title:       joi.string().required(),
						description: joi.string().required(),
						amount:      joi.number().integer().positive().allow(0).required(),
						percents:    joi.number().integer().positive().allow(0).required(),
					})),
					commissions: joi.array().items(joi.object().keys({
						name:        joi.string().required(),
						title:       joi.string().required(),
						description: joi.string().required(),
						amount:      joi.number().integer().positive().allow(0).required(),
					})),
				}),
			}),
		},
	})
	public async showDetailsForWithdrawalAmount (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showDetailsForWithdrawalAmount({
			amount: req.query.amount,
			lg:     req.auth.lg!,
		});

		return {
			amountForWithdrawal: result.amountForWithdrawal,
			resultAmount:        result.resultAmount,
			taxes:               result.taxes.map((tax: any) => {
				return {
					name:        tax.name,
					title:       tax.title,
					description: tax.description,
					amount:      tax.amount,
					percents:    tax.percents,
				};
			}),
			commissions: result.commissions.map((commission: any) => {
				return {
					name:        commission.name,
					title:       commission.title,
					description: commission.description,
					amount:      commission.amount,
				};
			}),
		};
	}

	@handler({
		description: 'Show cashback percentages',
		method:      'GET',
		path:        '/bonuses/cashback/percentages',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackPercentages,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					own:                joi.number().required(),
					ownExtra:           joi.number().allow(null),
					ownExtraExpiration: joi.date().allow(null),
					referral:           joi.object(),
				}),
			}),
		},
	})
	public async showCashbackPercentages (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showCashbackPercentages({
			counterpartyId: req.auth.counterpartyId,
		});

		return {
			own:                result.own,
			ownExtra:           result.ownExtra,
			ownExtraExpiration: result.ownExtraExpiration,
			referral:           result.referral,
		};
	}

	// FOR NON AUTHED USER
	@handler({
		description: 'Show cashback percentages for non-authed user',
		method:      'GET',
		path:        '/bonuses/cashback/percentages/default',
		auth:        AuthType.Session,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackPercentages,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					own:      joi.number().required(),
					referral: joi.object(),
				}),
			}),
		},
	})
	public async showDefaultCashbackPercentages (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showCashbackPercentages({});

		return {
			own:      result.own,
			referral: result.referral,
		};
	}

	@handler({
		description: 'Show cashback earnings (own, referral cashback by levels and total) grouped by months',
		method:      'GET',
		path:        '/bonuses/me/cashback/earnings/grouped',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackEarningsByMonths,
		},
		validate: {
			query: joi.object().keys({
				from: joi.date().required(),
				till: joi.date().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					earnings: joi.object().keys({
						total:    joi.number().integer().allow(0).required(),
						onLevels: joi.array().items(joi.number().integer().allow(0)).required(),
						own:      joi.number().integer().allow(0).required(),
					}),
				}),
			}),
		},
	})
	public async showCashbackEarningsGroupedByMonths (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showCashbackEarningsGroupedByMonths({
			counterpartyId: req.auth.counterpartyId!,
			from:           req.query.from,
			till:           req.query.till,
		});

		return {
			earnings: result.earnings.map((item) => {
				return {
					onLevels: item.onLevels,
					own:      item.own,
					total:    item.total,
				};
			}),
		};
	}

	@handler({
		description: 'Show cashback earnings grouped by categories',
		method:      'GET',
		path:        '/bonuses/me/cashback/earnings/grouped/categories',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackEarningsByCategories,
		},
		validate: {
			query: joi.object().keys({
				date: joi.date().allow(null),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					earnings: joi.object().keys({
						amount:        joi.number().positive(),
						category:      joi.string(),
						categoryTitle: joi.string(),
					}),
				}),
			}),
		},
	})
	public async showCashbackEarningsGroupedByCategories (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showCashbackEarningsGroupedByCategories({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			date:           req.query.date,
		});

		return {
			earnings: result.earnings.map((item) => {
				return {
					amount:        item.amount,
					category:      item.category,
					categoryTitle: item.categoryTitle,
				};
			}),
		};
	}

	@handler({
		description: 'Show cashback member status',
		method:      'GET',
		path:        '/bonuses/me/info',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getCashbackMemberStatus,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					status:                joi.string(),
					referralProgramStatus: joi.string(),
					memberAlias:           joi.string(),
				}),
			}),
		},
	})
	public async showMemberStatus (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.showMemberStatus({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			status:                result.status,
			referralProgramStatus: result.referralProgramStatus,
			memberAlias:           result.memberAlias,
		};
	}

	@handler({
		description: 'Receive redirectLink from frontend',
		method:      'POST',
		path:        '/bonuses/me/redirect-link',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.createRedirectLink,
		},
		validate: {
			body: joi.object().keys({
				redirectLink: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					done: joi.boolean(),
				}),
			}),
		},
	})
	public async setRedirectUrl (req: RequestObj): Promise<object> {
		const result = await this.bonusServiceClient.setRedirectUrl({
			counterpartyId: req.auth.counterpartyId!,
			redirectUrl:    req.body.redirectLink,
		});

		return {
			done: result.done,
		};
	}

	@handler({
		description: 'List operations for bonuses',
		method:      'GET',
		path:        '/bonuses/:category/operations',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.BONUS,
			action:   AuditAction.getListOfOperations,
		},
		cacheHeaders: {
			eTag: true,
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
					comment:                joi.string().allow(null).required(),
					terminalCategory:       joi.string().allow(null),
					avatarUrl:              joi.string().allow(null),
					errorText:              joi.string().allow(null),
					operationNumber:        joi.number().required(),
					iconId:                 joi.string().allow(null),
					fullName:               joi.string().allow(null),
					phone:                  joi.string().allow(null),
					ownComment:             joi.string().allow(null),
					ownCategory:            joi.string().allow(null),
				}),
			}),
		},
	})
	public async listOperationsByCategory (req: RequestObj): Promise<object> {
		const result = await this.operationServiceClient.listOperationsForAppSections({
			limit:  req.query.limit,
			skip:   req.query.skip,
			sort:   req.query.sort,
			filter: {
				counterpartyId: req.auth.counterpartyId!,
				lg:             req.auth.lg!,
				date:           {
					from: req.query.filter.date.from,
					till: req.query.filter.date.till,
				},
				cashbackOnly: true,
				categories:   [req.params.category],
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
					avatarUrl:              it.avatarUrl,
					errorText:              it.errorText,
					operationNumber:        it.operationNumber,
					comment:                it.comment,
					iconId:                 it.iconId,
					fullName:               it.fullName,
					ownComment:             it.ownComment,
					ownCategory:            it.ownCategory,
				};
			}),
		};
	}
}
