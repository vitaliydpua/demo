import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {DeliveryServiceClient} from 'rpc/lib/DeliveryServiceClient';


export class DeliveryController {

	constructor (
		private deliveryServiceClient: DeliveryServiceClient,
	) {
	}

	@handler({
		description: 'List shippers',
		method:      'GET',
		path:        '/deliveries/shippers',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getListOfShippers,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:   joi.string().required(),
							name: joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listShippers (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.listShippers({
			lg: req.auth.lg!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:   it.id,
					name: it.name,
				};
			}),
		};
	}

	@handler({
		description: 'List actual shippers',
		method:      'GET',
		path:        '/deliveries/shippers/v2',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getListOfShippers,
		},
		validate: {
			query: joi.object().keys({
				applicationType: joi.string().required(),
				shipperType:     joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:   joi.string().required(),
							name: joi.string().required(),
							type: joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listActualShippers (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.listActualShippers({
			counterpartyId:  req.auth.counterpartyId!,
			applicationType: req.query.applicationType,
			shipperType:     req.query.shipperType,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:   it.id,
					name: it.name,
					type: it.type,
				};
			}),
		};
	}

	@handler({
		description: 'Show waybill info by orderId',
		method:      'GET',
		path:        '/deliveries/orders/:orderId/waybill',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				orderId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					waybillId:            joi.string().required(),
					orderId:              joi.string().required(),
					shipperId:            joi.string().required(),
					deliveryCost:         joi.number().required(),
					status:               joi.string().required(),
					estimatedDeliveredAt: joi.date().allow(null).required(),
					storageUntil:         joi.date().allow(null).required(),
					deliveredAt:          joi.date().allow(null).required(),
					receivedAt:           joi.date().allow(null).required(),
					returnedAt:           joi.date().allow(null).required(),
					redirectedAt:         joi.date().allow(null).required(),
					rejectedAt:           joi.date().allow(null).required(),

					warehouse: joi.object().keys({
						id:        joi.string().required(),
						name:      joi.string().required(),
						number:    joi.string().allow(null).required(),
						address:   joi.string().required(),
						latitude:  joi.number().required(),
						longitude: joi.number().required(),
						shipperId: joi.string(),
						workDays:  joi.object().keys({
							monday: joi.object().keys({
								startTime: joi.number().allow(null),
								startMins: joi.number().allow(null),
								endTime:   joi.number().allow(null),
								endMins:   joi.number().allow(null),
							}).allow(null),
							tuesday: joi.object().keys({
								startTime: joi.number().allow(null),
								endTime:   joi.number().allow(null),
							}).allow(null),
							wednesday: joi.object().keys({
								startTime: joi.number().allow(null),
								endTime:   joi.number().allow(null),
							}).allow(null),
							thursday: joi.object().keys({
								startTime: joi.number().allow(null),
								endTime:   joi.number().allow(null),
							}).allow(null),
							friday: joi.object().keys({
								startTime: joi.number().allow(null),
								endTime:   joi.number().allow(null),
							}).allow(null),
							saturday: joi.object().keys({
								startTime: joi.number().allow(null),
								endTime:   joi.number().allow(null),
							}).allow(null),
							sunday: joi.object().keys({
								startTime: joi.number(),
								endTime:   joi.number(),
							}).allow(null),
						}).required(),
					}),
				}),
			}),
		},
	})
	public async showActualWaybill (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.showActualWaybillForUser({
			orderId:        req.params.orderId,
			counterpartyId: req.auth.counterpartyId!,
			lg:             req.auth.lg!,
		});

		return {
			waybillId:            result.id,
			orderId:              result.orderId,
			shipperId:            result.shipperId,
			number:               result.number,
			deliveryCost:         result.deliveryCost,
			status:               result.status,
			storageUntil:         result.storageUntil,
			estimatedDeliveredAt: result.estimatedDeliveredAt,
			recipientData:        result.recipientData,
			providerData:         result.providerData,
			deliveredAt:          result.deliveredAt,
			receivedAt:           result.receivedAt,
			returnedAt:           result.returnedAt,
			redirectedAt:         result.redirectedAt,
			rejectedAt:           result.rejectedAt,

			warehouse: {
				id:        result.warehouse.id,
				name:      result.warehouse.name,
				number:    result.warehouse.number,
				address:   result.warehouse.address,
				latitude:  result.warehouse.latitude,
				longitude: result.warehouse.longitude,
				workDays:  {
					monday:    result.warehouse.workDays.monday,
					tuesday:   result.warehouse.workDays.tuesday,
					wednesday: result.warehouse.workDays.wednesday,
					thursday:  result.warehouse.workDays.thursday,
					friday:    result.warehouse.workDays.friday,
					saturday:  result.warehouse.workDays.saturday,
					sunday:    result.warehouse.workDays.sunday,
				},
				shipperId: result.warehouse.shipperId,
			},
		};
	}

	@handler({
		description: 'List warehouses',
		method:      'GET',
		path:        '/deliveries/warehouses',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getListOfWarehouses,
		},
		validate: {
			query: joi.object().keys({
				latitude:  joi.number(),
				longitude: joi.number(),
				distance:  joi.number().positive(),
				filter:    joi.object().keys({
					text:        joi.string().allow(''),
					shippersIds: joi.array().items(joi.string()),
					shipperType: joi.string(),
				}),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:        joi.string().required(),
							name:      joi.string().required(),
							number:    joi.string().allow(null).required(),
							address:   joi.string().required(),
							latitude:  joi.number().required(),
							longitude: joi.number().required(),
							shipperId: joi.string(),
							workDays:  joi.object().keys({
								monday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								tuesday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								wednesday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								thursday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								friday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								saturday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								sunday: joi.object().keys({
									startTime: joi.number(),
									endTime:   joi.number(),
								}).allow(null),
							}).required(),
						}),
					),
				}),
			}),
		},
	})
	public async listWarehouses (req: RequestObj): Promise<object> {

		const result = await this.deliveryServiceClient.listWarehouses({
			lg:             req.auth.lg!,
			counterpartyId: req.auth.counterpartyId!,
			filter:         {
				text:        req.query.filter?.text || undefined,
				shippersIds: req.query.filter?.shippersIds,
				shipperType: req.query.filter?.shipperType,
				coordinates: (req.query.latitude && req.query.longitude) ? {
					latitude:  req.query.latitude,
					longitude: req.query.longitude,
				} : undefined,
				distance: req.query.distance,
			},
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:        it.id,
					name:      it.name,
					number:    it.number,
					address:   it.address,
					latitude:  it.latitude,
					longitude: it.longitude,
					workDays:  {
						monday:    it.workDays.monday,
						tuesday:   it.workDays.tuesday,
						wednesday: it.workDays.wednesday,
						thursday:  it.workDays.thursday,
						friday:    it.workDays.friday,
						saturday:  it.workDays.saturday,
						sunday:    it.workDays.sunday,
					},
					shipperId: it.shipperId,
				};
			}),
		};
	}

	@handler({
		description: 'Show warehouse by shipper and warehouse',
		method:      'GET',
		path:        '/deliveries/warehouses/:warehouseId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getWarehouse,
		},
		validate: {
			params: joi.object().keys({
				warehouseId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:        joi.string().required(),
					name:      joi.string().required(),
					number:    joi.string().allow(null).required(),
					address:   joi.string().required(),
					latitude:  joi.number().required(),
					longitude: joi.number().required(),
					shipperId: joi.string(),
					workDays:  joi.object().keys({
						monday: joi.object().keys({
							startTime: joi.number().allow(null),
							startMins: joi.number().allow(null),
							endTime:   joi.number().allow(null),
							endMins:   joi.number().allow(null),
						}).allow(null),
						tuesday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						wednesday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						thursday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						friday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						saturday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						sunday: joi.object().keys({
							startTime: joi.number(),
							endTime:   joi.number(),
						}).allow(null),
					}).required(),
				}),
			}),
		},
	})
	public async showWarehouse (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.showWarehouse({
			lg:          req.auth.lg!,
			warehouseId: req.params.warehouseId,
		});

		return {
			id:        result.id,
			name:      result.name,
			number:    result.number,
			address:   result.address,
			latitude:  result.latitude,
			longitude: result.longitude,
			workDays:  {
				monday:    result.workDays.monday,
				tuesday:   result.workDays.tuesday,
				wednesday: result.workDays.wednesday,
				thursday:  result.workDays.thursday,
				friday:    result.workDays.friday,
				saturday:  result.workDays.saturday,
				sunday:    result.workDays.sunday,
			},
			shipperId: result.shipperId,

		};
	}

	@handler({
		description: 'List partners',
		method:      'GET',
		path:        '/deliveries/partners',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getListOfPatterns,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:   joi.string().required(),
							name: joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listPartners (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.listPartners({
			lg: req.auth.lg!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:   it.id,
					name: it.name,
				};
			}),
		};
	}

	@handler({
		description: 'List atms',
		method:      'GET',
		path:        '/deliveries/atms/v2',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getListOfAtms,
		},
		validate: {
			query: joi.object().keys({
				latitude:  joi.number(),
				longitude: joi.number(),
				distance:  joi.number().positive(),
				filter:    joi.object().keys({
					text:        joi.string().allow(''),
					partnersIds: joi.array().items(joi.string()),
					types:       joi.array().items(joi.string()),
				}),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							id:        joi.string().required(),
							partnerId: joi.string().required(),
							type:      joi.string().required(),
							name:      joi.string().allow(null).required(),
							address:   joi.string().allow(null).required(),
							latitude:  joi.number().required(),
							longitude: joi.number().required(),
							workDays:  joi.object().keys({
								monday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								tuesday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								wednesday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								thursday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								friday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								saturday: joi.object().keys({
									startTime: joi.number().allow(null),
									endTime:   joi.number().allow(null),
								}).allow(null),
								sunday: joi.object().keys({
									startTime: joi.number(),
									endTime:   joi.number(),
								}).allow(null),
							}).required(),
						}),
					),
				}),
			}),
		},
	})
	public async listAtmsV2 (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.listAtms({
			lg:     req.auth.lg!,
			filter: {
				text:        req.query.filter?.text || undefined,
				partnersIds: req.query.filter?.partnersIds,
				types:       req.query.filter?.types,
				coordinates: (req.query.latitude && req.query.longitude) ? {
					latitude:  req.query.latitude,
					longitude: req.query.longitude,
				} : undefined,
				distance: req.query.distance,
			},
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					id:        it.id,
					partnerId: it.partnerId,
					type:      it.type,
					name:      it.name,
					address:   it.address,
					latitude:  it.latitude,
					longitude: it.longitude,
					workDays:  {
						monday:    it.workDays.monday,
						tuesday:   it.workDays.tuesday,
						wednesday: it.workDays.wednesday,
						thursday:  it.workDays.thursday,
						friday:    it.workDays.friday,
						saturday:  it.workDays.saturday,
						sunday:    it.workDays.sunday,
					},
				};
			}),
		};
	}

	@handler({
		description: 'Show atm',
		method:      'GET',
		path:        '/deliveries/atms/:atmId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.DELIVERY,
			action:   AuditAction.getAtm,
		},
		validate: {
			params: joi.object().keys({
				atmId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:        joi.string().required(),
					partnerId: joi.string().required(),
					type:      joi.string().required(),
					name:      joi.string().allow(null).required(),
					address:   joi.string().allow(null).required(),
					latitude:  joi.number().required(),
					longitude: joi.number().required(),
					workDays:  joi.object().keys({
						monday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						tuesday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						wednesday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						thursday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						friday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						saturday: joi.object().keys({
							startTime: joi.number().allow(null),
							endTime:   joi.number().allow(null),
						}).allow(null),
						sunday: joi.object().keys({
							startTime: joi.number(),
							endTime:   joi.number(),
						}).allow(null),
					}).required(),
				}),
			}),
		},
	})
	public async showAtm (req: RequestObj): Promise<object> {
		const result = await this.deliveryServiceClient.showAtm({
			lg:    req.auth.lg!,
			atmId: req.params.atmId,
		});

		return {
			id:        result.id,
			partnerId: result.partnerId,
			type:      result.type,
			name:      result.name,
			address:   result.address,
			latitude:  result.latitude,
			longitude: result.longitude,
			workDays:  {
				monday:    result.workDays.monday,
				tuesday:   result.workDays.tuesday,
				wednesday: result.workDays.wednesday,
				thursday:  result.workDays.thursday,
				friday:    result.workDays.friday,
				saturday:  result.workDays.saturday,
				sunday:    result.workDays.sunday,
			},
		};
	}
}
