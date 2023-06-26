import {AchievementServiceClient} from 'rpc/lib/AchievementServiceClient';
import {AuditAction, AuditCategory, handler} from '../decorators';
import joi from 'app/lib/app/Validator';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';

export class AchievementController {
	constructor (
		private achievementServiceClient: AchievementServiceClient,
	) {
	}

	@handler({
		description: 'Mark level as read',
		method:      'POST',
		path:        '/achievements/levels/:levelId/read',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.ACHIEVEMENT,
			action:   AuditAction.markLevelAsRead,
		},
		validate: {
			params: {
				levelId: joi.string().required(),
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
	public async markLevelAsRead (req: RequestObj): Promise<object> {
		await this.achievementServiceClient.markLevelAsRead({
			levelId:        req.params.levelId,
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			success: true,
		};
	}

	@handler({
		description: 'Show overview data for profile',
		method:      'GET',
		path:        '/achievements/info/:type',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.ACHIEVEMENT,
			action:   AuditAction.get,
		},
		validate: {
			params: {
				type: joi.string().valid('GENERAL', 'SEASON').required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					seasonName:                  joi.string().allow(null).required(),
					isSeasonExists:              joi.boolean().required(),
					isVisibleForRates:           joi.boolean().required(),
					completedAchievementsNumber: joi.number().required(),
					totalAchievementsNumber:     joi.number().required(),
					unreadAchievementsNumber:    joi.number().required(),
					unreadLevelsNumber:          joi.number().required(),
					currentPosition:             joi.number().required(),
					previousPosition:            joi.number().required(),
				}),
			}),
		},
	})
	public async showOverviewData (req: RequestObj): Promise<object> {
		const result = await this.achievementServiceClient.showOverviewData({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			type:           req.params.type,
		});

		return {
			seasonName:                  result.seasonName,
			isSeasonExists:              result.isSeasonExists,
			isVisibleForRates:           result.isVisibleForRates,
			completedAchievementsNumber: result.completedAchievementsNumber,
			totalAchievementsNumber:     result.totalAchievementsNumber,
			unreadAchievementsNumber:    result.unreadAchievementsNumber,
			unreadLevelsNumber:          result.unreadLevelsNumber,
			currentPosition:             result.currentPosition,
			previousPosition:            result.previousPosition,
		};
	}

	@handler({
		description: 'List seasons overview data by counterparty',
		method:      'GET',
		path:        '/achievements/seasons',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.ACHIEVEMENT,
			action:   AuditAction.get,
		},
		validate: {
			query: joi.object().keys({
				limit: joi.number().integer(),
				skip:  joi.number().integer(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							seasonId:                    joi.string(),
							seasonName:                  joi.string().allow(null).required(),
							status:                      joi.string(),
							completedAchievementsNumber: joi.number().required(),
							totalAchievementsNumber:     joi.number().required(),
							unreadAchievementsNumber:    joi.number().required(),
							startDate:                   joi.date().required(),
							endDate:                     joi.date().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listSeasonsOverviewData (req: RequestObj): Promise<object> {
		const result = await this.achievementServiceClient.listSeasonsOverviewData({
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
			limit:          req.query.limit,
			skip:           req.query.skip,
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					seasonId:                    item.seasonId,
					seasonName:                  item.seasonName,
					status:                      item.status,
					completedAchievementsNumber: item.completedAchievementsNumber,
					totalAchievementsNumber:     item.totalAchievementsNumber,
					unreadAchievementsNumber:    item.unreadAchievementsNumber,
					startDate:                   item.startDate,
					endDate:                     item.endDate,
				};
			}),
		};
	}

	@handler({
		description: 'Get standings data',
		method:      'GET',
		path:        '/achievements/standings/:type',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.ACHIEVEMENT,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				type: joi.string().valid('GENERAL', 'SEASON').required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					top: joi.array().items(joi.object().keys({
						position:          joi.number().required(),
						points:            joi.number().required(),
						isVisibleForRates: joi.boolean().required(),
						photoUrl:          joi.string().allow(null).required(),
						mascot:            joi.string().allow(null).required(),
						name:              joi.string().allow(null).required(),
					})).required(),
					me: joi.object().keys({
						position:           joi.number().allow(null).required(),
						positionTitle:      joi.string().allow(null).required(),
						points:             joi.number().required(),
						changedInStandings: joi.string().valid('UP', 'DOWN', 'NO_CHANGED').allow(null).required(),
						isVisibleForRates:  joi.boolean().required(),
						photoUrl:           joi.string().allow(null).required(),
						mascot:             joi.string().allow(null).required(),
						name:               joi.string().allow(null).required(),
					}).required(),
				}),
			}),
		},
	})
	public async showStandingsData (req: RequestObj): Promise<object> {
		const result = await this.achievementServiceClient.showStandingsData({
			type:           req.params.type,
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
		});

		return {
			top: result.top.map((item) => {
				return {
					position:          item.position,
					points:            item.points,
					isVisibleForRates: item.isVisibleForRates,
					photoUrl:          item.photoUrl,
					mascot:            item.mascot,
					name:              item.name,
				};
			}),
			me: {
				position:           result.me.position,
				positionTitle:      result.me.positionTitle,
				points:             result.me.points,
				changedInStandings: result.me.changedInStandings,
				isVisibleForRates:  result.me.isVisibleForRates,
				photoUrl:           result.me.photoUrl,
				mascot:             result.me.mascot,
				name:               result.me.name,
			},
		};
	}

	@handler({
		description: 'List achievement',
		method:      'GET',
		path:        '/achievements',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.ACHIEVEMENT,
			action:   AuditAction.getList,
		},
		validate: {
			query: {
				filter: joi.object().keys({
					type:     joi.string().required(),
					seasonId: joi.string(),
				}).required(),
				limit: joi.number().positive().integer(),
				skip:  joi.number().positive().integer().allow(0),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(joi.object().keys({
						achievementId:  joi.string().required(),
						name:           joi.string().required(),
						isMultiLevel:   joi.boolean().required(),
						completedSteps: joi.number().required(),
						totalSteps:     joi.number().required(),
						isCompleted:    joi.boolean().required(),
						levels:         joi.array().items(joi.object().keys({
							levelId:          joi.string().required(),
							number:           joi.number().required(),
							title:            joi.string().required(),
							description:      joi.string().required(),
							possibleReward:   joi.string().required(),
							imageIdCompleted: joi.string().required(),
							completedSteps:   joi.number().required(),
							totalSteps:       joi.number().required(),
							isCompleted:      joi.boolean().required(),
							isRead:           joi.boolean().required(),
						})).required(),
					})),
				}),
			}),
		},
	})
	public async listAchievements (req: RequestObj): Promise<object> {
		const result = await this.achievementServiceClient.listAchievements({
			skip:   req.query.skip,
			limit:  req.query.limit,
			lg:     req.auth.lg!,
			filter: {
				counterpartyId: req.auth.counterpartyId!,
				type:           req.query.filter.type!,
				seasonId:       req.query.filter.seasonId!,
			},
		});

		return {
			total: result.total,
			items: result.items.map((item) => {
				return {
					achievementId:  item.achievementId,
					name:           item.name,
					isMultiLevel:   item.isMultiLevel,
					completedSteps: item.completedSteps,
					totalSteps:     item.totalSteps,
					isCompleted:    item.isCompleted,
					levels:         item.levels.map((level) => {
						return {
							levelId:          level.levelId,
							number:           level.number,
							title:            level.title,
							description:      level.description,
							possibleReward:   level.possibleReward,
							imageIdCompleted: level.imageIdCompleted,
							completedSteps:   level.completedSteps,
							totalSteps:       level.totalSteps,
							isCompleted:      level.isCompleted,
							isRead:           level.isRead,
						};
					}),
				};
			}),
		};
	}

	@handler({
		description: 'Show achievement',
		method:      'GET',
		path:        '/achievements/:achievementId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.ACHIEVEMENT,
			action:   AuditAction.get,
		},
		validate: {
			params: {
				achievementId: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					achievementId:  joi.string().required(),
					name:           joi.string().required(),
					isMultiLevel:   joi.boolean().required(),
					completedSteps: joi.number().required(),
					totalSteps:     joi.number().required(),
					isCompleted:    joi.boolean().required(),
					levels:         joi.array().items(joi.object().keys({
						levelId:          joi.string().required(),
						number:           joi.number().required(),
						title:            joi.string().required(),
						description:      joi.string().required(),
						possibleReward:   joi.string().required(),
						imageIdCompleted: joi.string().required(),
						completedSteps:   joi.number().required(),
						totalSteps:       joi.number().required(),
						isCompleted:      joi.boolean().required(),
						isRead:           joi.boolean().required(),
					})).required(),
				}),
			}),
		},
	})
	public async showAchievement (req: RequestObj): Promise<object> {
		const result = await this.achievementServiceClient.showAchievement({
			achievementId:  req.params.achievementId,
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
		});

		return {
			achievementId:  result.achievementId,
			name:           result.name,
			isMultiLevel:   result.isMultiLevel,
			completedSteps: result.completedSteps,
			totalSteps:     result.totalSteps,
			isCompleted:    result.isCompleted,
			levels:         result.levels.map((level) => {
				return {
					levelId:          level.levelId,
					number:           level.number,
					title:            level.title,
					description:      level.description,
					possibleReward:   level.possibleReward,
					imageIdCompleted: level.imageIdCompleted,
					completedSteps:   level.completedSteps,
					totalSteps:       level.totalSteps,
					isCompleted:      level.isCompleted,
					isRead:           level.isRead,
				};
			}),
		};
	}
}
