import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';
import {UserServiceClient} from 'rpc/lib/UserServiceClient';
import {BankingServiceClient} from 'rpc/lib/BankingServiceClient';
import {AgentServiceClient} from 'rpc/lib/AgentServiceClient';
import {IVerifyEmailResult} from 'rpc/lib/types/user-service.types';
import { CardServiceClient } from 'rpc/lib/CardServiceClient';


export class UserController {

	constructor (
		private userServiceClient: UserServiceClient,
		private bankingServiceClient: BankingServiceClient,
		private agentServiceClient: AgentServiceClient,
		private cardServiceClient: CardServiceClient,
	) {}

	@handler({
		description: 'Create session',
		method:      'POST',
		path:        '/users/sessions',
		auth:        DefaultAuthType.None,
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.createSession,
		},
		validate: {
			body: joi.object().keys({
				installationId: joi.string().guid().required(),
				appVersion:     joi.string(),
				timezone:       joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					sessionId: joi.string().guid().required(),
					secret:    joi.string().required(),
				}),
			}),
		},
	})
	public async createSession (req: RequestObj): Promise<object> {
		const session = await this.userServiceClient.createSession({
			installationId: req.body.installationId,
			appVersion:     req.body.appVersion,
			timezone:       req.body.timezone,
		});

		return {
			sessionId: session.sessionId,
			secret:    session.secret,
		};
	}

	@handler({
		description: 'Get general info about session and user',
		method:      'GET',
		path:        '/users/sessions/me/info',
		auth:        AuthType.Session,
		validate:    {},
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.getSession,
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					isPhoneVerified: joi.boolean().required(),
					isPasswordSet:   joi.boolean().required(),
				}),
			}),
		},
	})
	public async showSessionInfo (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.showSessionInfo({
			sessionId: req.auth.sessionId!,
		});

		return {
			isPhoneVerified: result.isPhoneVerified,
			isPasswordSet:   result.isPasswordSet,
		};
	}

	@handler({
		description: 'Auth user',
		method:      'POST',
		path:        '/users/auth',
		auth:        AuthType.Phone,
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.login,
		},
		validate: {
			body: joi.object().keys({
				password: joi.string(),
				bioToken: joi.string(),
			})
			.xor('password', 'bioToken'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					userId:          joi.string().required(),
					phone:           joi.string().required(),
					name:            joi.string().required(),
					email:           joi.string().email().required(),
					status:          joi.string().allow('NEW', 'ACTIVE', 'INACTIVE').required(),
					createdAt:       joi.date().min('1900-01-01').max('now'),
					privateKey:      joi.string().required(),
					unverifiedEmail: joi.string().required(),
					counterparty:    joi.object().keys({
						status: joi.string().required(),
					}),
					agentsData: joi.object().keys({
						helsi: joi.object().keys({
							token:  joi.string().allow(null),
							secret: joi.string().allow(null),
						}),
					}),
				}),
			}),
		},
	})
	public async authUser (req: RequestObj): Promise<object> {
		const user = await this.userServiceClient.authUser({
			sessionId: req.auth.sessionId!,
			phone:     req.auth.phone!,
			password:  req.body.password,
			bioToken:  req.body.bioToken,
		});

		const counterpartyInfo = await this.bankingServiceClient.showCounterpartyInfoWithPrivateKey({
			counterpartyId: user.counterpartyId,
		});

		const agentsData = {
			helsi: {},
		};

		try {
			const helsiAgentsData = await this.agentServiceClient.showHelsiAuthCredentials({
				counterpartyId: user.counterpartyId,
			});

			agentsData.helsi = {
				token:  helsiAgentsData.token,
				secret: helsiAgentsData.secret,
			};
		} catch (error: any) {
			if (error?.data?.appError?.code !== 'NOT FOUND') {
				throw error;
			}

			agentsData.helsi = {
				token:  null,
				secret: null,
			};
		}

		return {
			userId:          user.userId,
			phone:           user.phone,
			name:            user.name,
			email:           user.email,
			status:          user.status,
			createdAt:       user.createdAt,
			privateKey:      counterpartyInfo.privateKey,
			unverifiedEmail: user.unverifiedEmail,
			counterparty:    {
				status: counterpartyInfo.status,
			},
			agentsData: agentsData,
		};
	}

	@handler({
		description: 'Auth user full',
		method:      'POST',
		path:        '/users/auth/full',
		auth:        AuthType.Phone,
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.login,
		},
		validate: {
			headers: joi.any(),
			body:    joi.object().keys({
				password: joi.string(),
				bioToken: joi.string(),
				otpAuth:  joi.boolean(),
			})
			.xor('password', 'bioToken'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					userId:               joi.string().required(),
					phone:                joi.string().required(),
					name:                 joi.string().allow(null).required(),
					email:                joi.string().allow(null).required(),
					status:               joi.string().required(),
					photoId:              joi.string().allow(null).required(),
					createdAt:            joi.date().allow(null).required(),
					unverifiedEmail:      joi.string().allow(null).required(),
					memberAlias:          joi.string().required(),
					isFirstCardCompleted: joi.boolean().required(),
					isHadOwnCard:         joi.boolean().required(),
					allowedLanguages:     joi.array().items(joi.string()).required(),
					config:               {
						isApplePayEnabled: joi.boolean().required(),
					},
					settings: {
						templateId:              joi.string().allow(null).required(),
						lg:                      joi.string().required(),
						defaultMessenger:        joi.string().allow(null).required(),
						mascot:                  joi.string().allow(null).required(),
						isAllowedToShow:         joi.boolean().allow(null).required(),
						isSendBudgetPush:        joi.boolean().allow(null).required(),
						displayDecimalInAmounts: joi.boolean().required(),
						allowedFeatures:         joi.array().items(
							joi.string(),
						).required(),
						testing: joi.object().keys({
							isTester: joi.boolean().required(),
							features: joi.array().items(
								joi.string().valid('DIIA'),
							),
						}).required(),
					},
					statuses: {
						counterpartyStatus:    joi.string().required(),
						userStatus:            joi.string().required(),
						bonusProgramStatus:    joi.string().required(),
						referralProgramStatus: joi.string().required(),
						budgetStatus:          joi.string().required(),
					},
					encryption: {
						privateKey:    joi.string().required(),
						currentLogKey: {
							logKeyId:  joi.string().required(),
							publicKey: joi.string().required(),
						},
					},
					agentsData: joi.object().keys({
						helsi: joi.object().keys({
							token:  joi.string().allow(null).required(),
							secret: joi.string().allow(null).required(),
						}),
					}),
					achievementsData: joi.object().keys({
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
					identification: joi.object().keys({
						progressStatus:  joi.string().allow(null).required(),
						lastCompletedAt: joi.date().allow(null).required(),
						expiresDate:     joi.date().allow(null).required(),
						expiresReason:   joi.string().allow(null).required(),
					}),
				}),
			}),
		},
	})
	public async authUserFull (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.authUserExtraData({
			sessionId:      req.auth.sessionId!,
			phone:          req.auth.phone!,
			password:       req.body.password,
			bioToken:       req.body.bioToken,
			sendDeviceInfo: req.body.otpAuth || false,
			ip:             req.ip,
		});

		return {
			userId:               result.userId,
			phone:                result.phone,
			name:                 result.name,
			email:                result.email,
			status:               result.status,
			photoId:              result.photoId,
			createdAt:            result.createdAt,
			unverifiedEmail:      result.unverifiedEmail,
			memberAlias:          result.memberAlias,
			isFirstCardCompleted: result.isFirstCardCompleted,
			isHadOwnCard:         result.isHadOwnCard,
			allowedLanguages:     result.allowedLanguages,
			config:               {
				isApplePayEnabled: result.config.isApplePayEnabled,
			},
			settings: {
				templateId:              result.settings.templateId,
				lg:                      result.settings.lg,
				defaultMessenger:        result.settings.defaultMessenger,
				mascot:                  result.settings.mascot,
				isAllowedToShow:         result.settings.isAllowedToShow,
				isSendBudgetPush:        result.settings.isSendBudgetPush,
				displayDecimalInAmounts: result.settings.displayDecimalInAmounts,
				allowedFeatures:         result.settings.allowedFeatures,
				testing:                 {
					isTester: result.settings.testing.isTester,
					features: result.settings.testing.features,
				},
			},
			statuses: {
				counterpartyStatus:    result.statuses.counterpartyStatus,
				userStatus:            result.statuses.userStatus,
				bonusProgramStatus:    result.statuses.bonusProgramStatus,
				referralProgramStatus: result.statuses.referralProgramStatus,
				budgetStatus:          result.statuses.budgetStatus,
			},
			encryption: {
				privateKey:    result.encryption.privateKey,
				currentLogKey: {
					logKeyId:  result.encryption.currentLogKey.logKeyId,
					publicKey: result.encryption.currentLogKey.publicKey,
				},
			},
			agentsData: {
				helsi: {
					token:  null,
					secret: null,
				},
			},
			achievementsData: {
				seasonName:                  result.achievementsData.seasonName,
				isSeasonExists:              result.achievementsData.isSeasonExists,
				isVisibleForRates:           result.achievementsData.isVisibleForRates,
				completedAchievementsNumber: result.achievementsData.completedAchievementsNumber,
				totalAchievementsNumber:     result.achievementsData.totalAchievementsNumber,
				unreadAchievementsNumber:    result.achievementsData.unreadAchievementsNumber,
				unreadLevelsNumber:          result.achievementsData.unreadLevelsNumber,
				currentPosition:             result.achievementsData.currentPosition,
				previousPosition:            result.achievementsData.previousPosition,
			},
			identification: {
				progressStatus:  result.identification.progressStatus,
				lastCompletedAt: result.identification.lastCompletedAt,
				expiresDate:     result.identification.expiresDate,
				expiresReason:   result.identification.expiresReason,
			},
		};
	}

	@handler({
		description: 'Create bioToken for current user installation',
		method:      'POST',
		path:        '/users/bio-token',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.createInstallation,
		},
		validate: {
			body: joi.object().keys({
				password: joi.string().required(),
				bioToken: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					sessionId: joi.string().required(),
				}),
			}),
		},
	})
	public async createBioToken (req: RequestObj): Promise<object> {
		await this.userServiceClient.createBioToken({
			installationId: req.auth.installationId!,
			bioToken:       req.body.bioToken,
			userId:         req.auth.userId!,
			password:       req.body.password,
		});

		return {
			sessionId: req.auth.sessionId!,
		};
	}

	@handler({
		description: 'Delete bioToken from current user installation',
		method:      'DELETE',
		path:        '/users/bio-token/current',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.deleteInstallation,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					sessionId: joi.string().required(),
				}),
			}),
		},
	})
	public async deleteBioToken (req: RequestObj): Promise<object> {
		await this.userServiceClient.deleteBioToken({
			installationId: req.auth.installationId!,
		});

		return {
			sessionId: req.auth.sessionId!,
		};
	}

	@handler({
		description: 'Logout user (Drop session)',
		method:      'DELETE',
		path:        '/users/sessions/me',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.AUTH,
			action:   AuditAction.logout,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					sessionId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async logoutUser (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.deleteSession({
			sessionId: req.auth.sessionId!,
		});

		return {
			sessionId: result.sessionId,
		};
	}

	@handler({
		description: 'Create user verification (send OTP code to phone)',
		method:      'POST',
		path:        '/users/verifications',
		auth:        AuthType.Session,
		audit:       {
			category: AuditCategory.OTP,
			action:   AuditAction.send,
		},
		validate: {
			body: joi.object().keys({
				phone: joi.string().phone().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					otpId:    joi.string().guid().required(),
					interval: joi.number().required(),
				}),
			}),
		},
	})
	public async createVerification (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.createVerification({
			phone:          req.body.phone,
			installationId: req.auth.installationId!,
		});

		return {
			otpId:    result.otpId,
			interval: result.interval,
		};
	}

	@handler({
		description: 'Process user verification (verify OTP code)',
		method:      'PATCH',
		path:        '/users/verifications',
		auth:        AuthType.Session,
		audit:       {
			category: AuditCategory.OTP,
			action:   AuditAction.verify,
		},
		validate: {
			body: joi.object().keys({
				otpId: joi.string().guid().required(),
				code:  joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					success:      joi.boolean().required(),
					attemptsLeft: joi.number().integer().required(),
				}),
			}),
		},
	})
	public async processVerification (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.processVerification({
			sessionId: req.auth.sessionId!,
			otpId:     req.body.otpId,
			code:      req.body.code,
		});

		return {
			success:      result.success,
			attemptsLeft: result.attemptsLeft,
		};
	}

	@handler({
		description: 'Set user password',
		method:      'POST',
		path:        '/users/me/password',
		auth:        AuthType.Phone,
		audit:       {
			category: AuditCategory.PASSWORD,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				password: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					status: joi.boolean().required(),
				}),
			}),
		},
	})
	public async setUserPassword (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.setUserPassword({
			phone:    req.auth.phone!,
			password: req.body.password,
		});

		return {
			status: result.status,
		};
	}

	@handler({
		description: 'Update user password',
		method:      'PATCH',
		path:        '/users/me/password',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PASSWORD,
			action:   AuditAction.modify,
		},
		validate: {
			body: joi.object().keys({
				currentPassword: joi.string().required(),
				password:        joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					status: joi.boolean().required(),
				}),
			}),
		},
	})
	public async changeUserPassword (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.changeUserPassword({
			userId:          req.auth.userId!,
			currentPassword: req.body.currentPassword,
			password:        req.body.password,
		});

		return {
			status: result.status,
		};
	}


	@handler({
		description: 'Get user settings',
		method:      'GET',
		path:        '/users/me/settings',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.SETTINGS,
			action:   AuditAction.get,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					templateId:              joi.string().guid(),
					lg:                      joi.string().length(2),
					defaultMessenger:        joi.string(),
					mascot:                  joi.string(),
					isAllowedToShow:         joi.boolean(),
					isSendBudgetPush:        joi.boolean(),
					displayDecimalInAmounts: joi.boolean(),
				}),
			}),
		},
	})
	public async showUserSettings (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.showFullUserSettings({
			userId: req.auth.userId!,
		});

		return {
			templateId:              result.templateId,
			lg:                      result.lg,
			defaultMessenger:        result.defaultMessenger,
			mascot:                  result.mascot,
			isAllowedToShow:         result.isAllowedToShow,
			isSendBudgetPush:        result.isSendBudgetPush,
			displayDecimalInAmounts: result.displayDecimalInAmounts,
		};
	}

	@handler({
		description: 'Update user settings',
		method:      'PATCH',
		path:        '/users/me/settings',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.SETTINGS,
			action:   AuditAction.modify,
		},
		validate: {
			body: joi.object().keys({
				templateId:              joi.string().guid(),
				lg:                      joi.string().length(2),
				defaultMessenger:        joi.string(),
				mascot:                  joi.string(),
				isAllowedToShow:         joi.boolean(),
				isSendBudgetPush:        joi.boolean(),
				displayDecimalInAmounts: joi.boolean(),
				isVisibleForRates:       joi.boolean(),
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
	public async updateUserSettings (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.updateUserSettings({
			userId:                  req.auth.userId!,
			templateId:              req.body.templateId,
			lg:                      req.body.lg,
			defaultMessenger:        req.body.defaultMessenger,
			mascot:                  req.body.mascot,
			isAllowedToShow:         req.body.isAllowedToShow,
			isSendBudgetPush:        req.body.isSendBudgetPush,
			displayDecimalInAmounts: req.body.displayDecimalInAmounts,
			isVisibleForRates:       req.body.isVisibleForRates,
		});

		return {
			success: result.success,
		};
	}

	@handler({
		description: 'Get config params',
		method:      'GET',
		path:        '/users/me/config',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.SETTINGS,
			action:   AuditAction.get,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					isApplePayEnabled: joi.boolean(),
				}),
			}),
		},
	})
	public async getConfigParams (req: RequestObj): Promise<object> {
		const result = await this.cardServiceClient.getConfigParams({
			userId: req.auth.userId!,
		});

		return {
			isApplePayEnabled: result.isApplePayEnabled,
		};
	}

	// Update user's name
	@handler({
		description: 'Update user name',
		method:      'PATCH',
		path:        '/users/me/name',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.USERNAME,
			action:   AuditAction.modify,
		},
		validate: {
			body: joi.object().keys({
				name: joi.string().trim().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					userId: joi.boolean().required(),
				}),
			}),
		},
	})
	public async changeUserName (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.updateUserName({
			userId: req.auth.userId!,
			name:   req.body.name,
		});

		return {
			userId: result.userId,
		};
	}

	@handler({
		description: 'Set user profile photo',
		method:      'PATCH',
		path:        '/users/me/photo',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PHOTO,
			action:   AuditAction.modify,
		},
		validate: {
			body: {
				photo: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					counterpartyId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async setUserPhoto (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.setUserPhoto({
			counterpartyId: req.auth.counterpartyId!,
			photo:          req.body.photo,
		});

		return {
			counterpartyId: result.counterpartyId,
		};
	}

	@handler({
		description: 'Update users unverified email',
		method:      'PATCH',
		path:        '/users/me/email',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.EMAIL,
			action:   AuditAction.modify,
		},
		validate: {
			body: joi.object().keys({
				unverifiedEmail: joi.string().trim().email({tlds: false}).required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					userId: joi.string().required(),
				}),
			}),
		},
	})
	public async sendVerificationEmail (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.updateUserUnverifiedEmail({
			userId:          req.auth.userId!,
			unverifiedEmail: req.body.unverifiedEmail,
		});

		return {
			userId: result.userId,
		};
	}

	@handler({
		description: 'Sends verification email for user',
		method:      'POST',
		path:        '/users/me/email/verify',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.EMAIL,
			action:   AuditAction.verify,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					userId: joi.string().required(),
				}),
			}),
		},
	})
	public async updateUserEmail (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.sendVerificationEmail({
			userId: req.auth.userId!,
		});

		return {
			userId: result.userId,
		};
	}

	@handler({
		description: 'Verifies email via given code',
		path:        '/users/email/verify',
		method:      'POST',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.EMAIL,
			action:   AuditAction.verify,
		},
		validate: {
			body: joi.object().keys({
				code: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				success:      joi.boolean(),
				attemptsLeft: joi.number(),
				email:        joi.string().email(),
			}),
		},
		options: {
			redirect: false,
		},
	})
	public async verifyEmail (req: RequestObj): Promise<IVerifyEmailResult> {
		const result = await this.userServiceClient.verifyEmail({
			userId: req.auth.userId!,
			code:   req.body.code,
		});

		return {
			success:      result.success,
			attemptsLeft: result.attemptsLeft,
			email:        result.email,
		};
	}

	@handler({
		description: 'Get user profile information',
		method:      'GET',
		path:        '/users/me/profile',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.PROFILE,
			action:   AuditAction.get,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					name:            joi.string(),
					email:           joi.string().email(),
					unverifiedEmail: joi.string().email(),
					photoId:         joi.string().guid(),
					phone:           joi.string(),
				}),
			}),
		},
	})
	public async showUserProfileInfo (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.showUser({
			userId: req.auth.userId!,
		});

		return {
			name:            result.name,
			email:           result.email,
			unverifiedEmail: result.unverifiedEmail,
			photoId:         result.photoId,
			phone:           result.phone,
		};
	}

	@handler({
		description: 'Create restore password request',
		method:      'POST',
		auth:        AuthType.Phone,
		path:        '/users/me/restore-password',
		audit:       {
			category: AuditCategory.PASSWORD,
			action:   AuditAction.restore,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				requestId:      joi.string().guid().required(),
				isCounterparty: joi.boolean().required(),
			}),
		},
	})
	public async createRestorePasswordRequest (req: RequestObj): Promise<{ requestId: string; isCounterparty: boolean }> {
		const result = await this.userServiceClient.createRestorePasswordRequest({
			phone:          req.auth.phone!,
			installationId: req.auth.installationId!,
		});

		return {
			requestId:      result.requestId,
			isCounterparty: result.isCounterparty,
		};
	}

	@handler({
		description: 'Verify restore password request OTP',
		method:      'PATCH',
		auth:        AuthType.Phone,
		audit:       {
			category: AuditCategory.OTP,
			action:   AuditAction.verify,
		},
		path:     '/users/me/restore-password/:requestId/otp',
		validate: {
			body: joi.object().keys({
				otpCode: joi.string().required(),
			}),
			params: joi.object().keys({
				requestId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				success:      joi.boolean().required(),
				attemptsLeft: joi.number(),
			}),
		},
	})
	public async verifyRestoreRequestOtp (req: RequestObj): Promise<{ success: boolean; attemptsLeft?: number }> {
		const result = await this.userServiceClient.verifyRestoreRequestOtp({
			requestId: req.params.requestId,
			phone:     req.auth.phone!,
			otpCode:   req.body.otpCode,
		});

		return {
			success:      result.success,
			attemptsLeft: result.attemptsLeft,
		};
	}

	@handler({
		description: 'Verify restore password request PAN',
		method:      'PATCH',
		auth:        AuthType.Phone,
		audit:       {
			category: AuditCategory.PASSWORD,
			action:   AuditAction.verify,
		},
		path:     '/users/me/restore-password/:requestId/pan',
		validate: {
			body: joi.object().keys({
				pan: joi.string().required(),
			}),
			params: joi.object().keys({
				requestId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				requestId: joi.string().guid().required(),
			}),
		},
	})
	public async verifyRestoreRequestPan (req: RequestObj): Promise<{ requestId: string }> {
		const result = await this.userServiceClient.verifyRestoreRequestPan({
			requestId: req.params.requestId,
			phone:     req.auth.phone!,
			pan:       req.body.pan,
		});

		return {
			requestId: result.requestId,
		};
	}

	@handler({
		description: 'Restore user\'s password',
		method:      'PATCH',
		auth:        AuthType.Phone,
		audit:       {
			category: AuditCategory.PASSWORD,
			action:   AuditAction.restore,
		},
		path:     '/users/me/restore-password/:requestId/password',
		validate: {
			body: joi.object().keys({
				password: joi.string().required(),
			}),
			params: joi.object().keys({
				requestId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				requestId: joi.string().guid().required(),
			}),
		},
	})
	public async restoreUserPassword (req: RequestObj): Promise<{ requestId: string }> {
		const result = await this.userServiceClient.restoreUserPassword({
			requestId: req.params.requestId,
			phone:     req.auth.phone!,
			password:  req.body.password,
		});

		return {
			requestId: result.requestId,
		};
	}

	@handler({
		description: 'Cancel users email verification',
		method:      'DELETE',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.EMAIL,
			action:   AuditAction.cancel,
		},
		path:     '/users/me/email/verify',
		validate: {},
		response: {
			200: joi.object().keys({
				userId: joi.string().guid().required(),
			}),
		},
	})
	public async cancelEmailVerification (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.cancelEmailVerification({
			userId: req.auth.userId!,
		});

		return {
			userId: result.userId,
		};
	}

	@handler({
		description: 'Create change phone request for user without counterparty (send OTP code to phone)',
		method:      'POST',
		auth:        AuthType.User,
		path:        '/users/me/change-phone/user',
		audit:       {
			category: AuditCategory.PHONE,
			action:   AuditAction.send,
		},
		validate: {
			body: joi.object().keys({
				phone: joi.string().phone().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				requestId: joi.string().guid().required(),
				interval:  joi.number().required(),
			}),
		},
	})
	public async createChangeUserPhoneRequest (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.createChangePhoneRequest({
			userId:         req.auth.userId!,
			phone:          req.body.phone,
			installationId: req.auth.installationId!,
		});

		return {
			requestId: result.requestId,
			interval:  result.interval,
		};
	}

	@handler({
		description: 'Create counterparty change phone request (send OTP code to phone)',
		method:      'POST',
		auth:        AuthType.Signature,
		path:        '/users/me/change-phone/counterparty',
		audit:       {
			category: AuditCategory.PHONE,
			action:   AuditAction.send,
		},
		validate: {
			body: joi.object().keys({
				phone: joi.string().phone().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				requestId: joi.string().guid().required(),
				interval:  joi.number().required(),
			}),
		},
	})
	public async createChangeCounterpartyPhoneRequest (req: RequestObj): Promise<object> {
		const result = await this.userServiceClient.createChangePhoneRequest({
			userId:         req.auth.userId!,
			phone:          req.body.phone,
			installationId: req.auth.installationId!,
		});

		return {
			requestId: result.requestId,
			interval:  result.interval,
		};
	}
}
