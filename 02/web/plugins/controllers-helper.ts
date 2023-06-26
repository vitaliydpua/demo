import {Express, Request, Response, Router} from 'express';
import joi from 'app/lib/app/Validator';
import fs from 'fs';
import crypto from 'crypto';
import {WebError} from 'app/lib/interfaces/web/WebError';
import {IHandlerData} from '../decorators';
import {IAuth} from 'app/lib/interfaces/auth.types';
import {Logger} from 'app/lib/app/Logger';
import {request} from 'http';
import {RequestLogger} from '../../../domain/requestLogger/RequestLogger';
import stringify from 'json-stringify-safe';
import {ThrottleService, ThrottleSimilarRequestType} from '../../../domain/throttle/ThrottleService';
import {ERROR_CODE_UNIQUE} from 'app/lib/app/AppError';
import {UserAuth} from '../auth/UserAuth';
import {PhoneAuth} from '../auth/PhoneAuth';
import {SignatureAuth} from '../auth/SignatureAuth';


export function processControllers (app: Express): void {
	app.locals.controllers.forEach((controller: any) => {
		const router = Router();

		const pathPrefix = controller.pathPrefix || '/';

		Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).forEach((handlerName) => {
			const handler = controller[handlerName];

			const handlerData: IHandlerData = Reflect.getMetadata('handler:data', controller, handlerName);

			if (!handlerData) {
				return;
			}

			app.locals.logger.info(`Route ${handlerData.method} ${pathPrefix} ${handlerData.path} - ${handlerData.description}`);

			const method = handlerData.method.toLowerCase();
			const path   = handlerData.path;

			handlerData.handler = handler.bind(controller);
			handlerData.processReq = processReq(handlerData);

			validate(app, handlerData);
			(router as any)[method](path, wrapAuth(app, handlerData), wrap(app, handlerData));
		});

		app.use(pathPrefix, router);
	});
}


const KEYS_FOR_VALIDATION = ['query', 'body', 'params', 'headers'];
const VALIDATION_OPTIONS: Record<string, any> = {
	default: {
		abortEarly:   false,
		allowUnknown: false,
	},
	headers: {
		abortEarly:   false,
		allowUnknown: true, // для headers дозволяємо невідомі поля
	},
};

const handlerSchema = joi.object().keys({
	description:  joi.string().required(),
	method:       joi.string().required(),
	path:         joi.string().required(),
	auth:         joi.string().required(),
	validate:     joi.object().required(),
	handler:      joi.func().required(),
	processReq:   joi.func(),
	response:     joi.object().required(),
	options:      joi.object(),
	audit:        joi.object().allow(null),
	cacheHeaders: joi.object().allow(null),
});

function validate (app: Express, handlerData: any): void {
	const result = joi.validate(handlerData, handlerSchema);

	if (result.error) {
		app.locals.logger.fatal('Error on handler validation');
		throw result.error;
	}
}

function processReq (handlerData: IHandlerData) {
	return async function (req: any, res: any): Promise<any> {
		if (handlerData.validate) {
			KEYS_FOR_VALIDATION.forEach((key) => {
				const schema = (handlerData.validate as any)[key];

				// не стираємо headers, у випадку коли схема не визначена, headers - приймають часткову участь у роботі Express.request
				if (!schema && key === 'headers') {
					return req[key];
				} else if (!schema) {
					return req[key] = {};
				}

				const validationResult = joi.validate(req[key], schema, VALIDATION_OPTIONS[key] || VALIDATION_OPTIONS.default);
				req[key] = validationResult.value;

				if (validationResult.error) {
					const details = {
						in:     key,
						errors: (validationResult.error.details || []).map((it: any) => {
							return {
								message: it.message,
								key:     (it.context || {}).key,
								value:   (it.context || {}).value,
							};
						}),
					};
					throw new WebError(400, 'VALIDATION ERROR', `Request validation failed in ${key}`, details);
				}
			});
		}

		return handlerData.handler!(req, res);
	};
}

function wrapAuth (app: Express, handlerData: IHandlerData) {
	return async function (req: Request, res: Response, next: (err?: Error) => void) {
		const throttleService: ThrottleService = app.locals.throttleService;
		const method = req.method.toLowerCase();
		let credentialsName;

		try {
			const auth: IAuth = app.locals.auth[handlerData.auth];

			const credentials = await auth.credentials(req);

			if ((auth instanceof PhoneAuth || auth instanceof UserAuth || auth instanceof SignatureAuth) && credentials.name) {
				await throttleService.globalThrottle(req.ip);
			} else {
				await throttleService.nonAuthThrottle(req.ip);
			}

			if (credentials && credentials.name) {
				const splittedEndpoint = req.originalUrl.toLowerCase().split('/');
				const excludedSimilarThrottlingEndpoints = app.locals.config.excludedSimilarThrottlingEndpoints;
				const isExcluded = throttleSimilarRequestIsExclude(method, splittedEndpoint, excludedSimilarThrottlingEndpoints);

				if (credentials.name && ['post', 'put', 'patch', 'delete'].includes(method) && !isExcluded) {
					credentialsName = credentials.name; // here for not trying clear if no add

					await throttleService.throttleSimilarRequest({
						type:      ThrottleSimilarRequestType.REQUEST,
						sessionId: credentialsName, // same to req.auth.sessionId after auth
						method:    method,
						urlPath:   req.originalUrl,
					});
				}
			}

			/* eslint require-atomic-updates: 0 */
			req.auth = await auth.auth(req, credentials);

			return next();

		} catch (err: any) {
			// If error in auth clear throttle. But not if it's TOO_MANY_SIMILAR_REQUESTS
			if ((err.errorCode !== ERROR_CODE_UNIQUE.TOO_MANY_SIMILAR_REQUESTS) &&
				credentialsName && ['post', 'put', 'patch', 'delete'].includes(method)) {

				await throttleService.throttleSimilarRequest({
					type:      ThrottleSimilarRequestType.RESPONSE,
					sessionId: credentialsName,
					method:    method,
					urlPath:   req.originalUrl,
				});
			}

			return next(err);
		}
	};
}

function wrap (app: Express, handlerData: IHandlerData) {
	return async function (req: Request, res: Response, next: (err?: Error) => void): Promise<Response | void> {
		const logger: Logger = app.locals.logger;
		const requestLogger: RequestLogger = app.locals.requestLogger;
		const throttleService: ThrottleService = app.locals.throttleService;
		let logId: number | null = null;
		const method = req.method.toLowerCase();

		try {
			if (handlerData.audit && req.auth.installationId && req.auth.sessionId) {
				const bodyIds = getIds(req.body);
				const queryIds = getIds(req.query);
				const paramsIds = getIds(req.params);

				logId = await requestLogger.logClientData({
					ip:             req.ip,
					installationId: req.auth.installationId,
					sessionId:      req.auth.sessionId,
					phone:          req.auth.phone || null,
					userId:         req.auth.userId || null,
					counterpartyId: req.auth.counterpartyId || null,

					category: handlerData.audit.category,
					action:   handlerData.audit.action,
					method:   handlerData.handler?.name.replace('bound ', '') || '',

					...bodyIds,
					...queryIds,
					...paramsIds,
				});
			}

			const data = await handlerData.processReq!(req, res);

			const splittedEndpoint = req.originalUrl.toLowerCase().split('/');
			const excludedSimilarThrottlingEndpoints = app.locals.config.excludedSimilarThrottlingEndpoints;
			const isExcluded = throttleSimilarRequestIsExclude(method, splittedEndpoint, excludedSimilarThrottlingEndpoints);
			if (req.auth.sessionId && ['post', 'put', 'patch', 'delete'].includes(method) && !isExcluded) {
				await throttleService.throttleSimilarRequest({
					type:      ThrottleSimilarRequestType.RESPONSE,
					sessionId: req.auth.sessionId, // same to credentials.name
					method:    method,
					urlPath:   req.originalUrl,
				});
			}

			if (logId) {
				const responseIds = getIds(data);

				requestLogger.logClientResult({
					logId:  logId,
					result: 'SUCCESS',
					...responseIds,
				});
			}

			if (handlerData.cacheHeaders?.eTag && data) {
				const responseHash = generateResponseHash(data);
				if (responseHash) {
					res.setHeader('ETag', responseHash);
				}
			}

			if (handlerData.cacheHeaders?.xHistoryChangesId && req.auth.userId) {
				const cacheUpdatedAt = req.auth.cacheUpdatedAt ? req.auth.cacheUpdatedAt : null;

				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				res.setHeader('X-History-Changes-Id', req.auth.userId + '.' + cacheUpdatedAt);
			}

			if (res.headersSent) {
				return res;
			}

			if (handlerData.options?.sendFile) {
				if (data.filePath) {
					logger.info('send file', {
						step:   'start',
						target: req.target,
						data:   {
							filePath: data.filePath,
						},
					});

					return res.status(200).sendFile(data.filePath, (err) => {
						if (err) {
							logger.warn('send file', {
								step:   'end',
								target: req.target,
								data:   {
									filePath: data.filePath,
								},
								error: err,
							});

						} else {
							logger.warn('send file', {
								step:   'end',
								target: req.target,
								data:   {
									filePath: data.filePath,
								},
							});
						}

						if (handlerData.options?.deleteAfterSend) {
							logger.warn('delete file', {
								step:   'start',
								target: req.target,
								data:   {
									filePath: data.filePath,
								},
							});

							fs.unlink(data.filePath, (fsErr) => {
								if (fsErr) {
									logger.warn('delete file', {
										step:   'end',
										target: req.target,
										data:   {
											filePath: data.filePath,
										},
										error: err,
									});
								} else {
									logger.warn('delete file', {
										step:   'end',
										target: req.target,
										data:   {
											filePath: data.filePath,
										},
									});
								}
							});
						}
					});
				} else {
					return res.status(404).send(new WebError(404, 'FILE NOT FOUND', 'No file to send'));
				}
			} else if (handlerData.options?.redirect) {
				if (data.redirectLink) {
					return res.redirect(302, data.redirectLink);
				} else {
					return res.status(404).send(new WebError(404, 'REDIRECT NOT FOUND', 'No url to redirect'));
				}
			} else if (handlerData.options?.streamFile) {
				const requestFile = request(String(data));
				requestFile.end();

				requestFile.on('error', (err) => {
					return next(err);
				});

				requestFile.on('response', (response) => {
					if (typeof response.headers['content-type'] === 'string') {
						res.setHeader('Content-type', response.headers['content-type']);
					}

					response.on('error', (err) => {
						return next(err);
					});

					response.pipe(res);
				});
			} else {
				res.responseData = data;

				return res.status(200).send({
					data: data,
				});
			}

		} catch (err: any) {
			if (logId) {
				requestLogger.logClientResult({
					logId:  logId,
					result: 'ERROR',
					error:  stringify(err),
				});
			}

			if (req.auth.sessionId && ['post', 'put', 'patch', 'delete'].includes(method)) {
				await throttleService.throttleSimilarRequest({
					type:      ThrottleSimilarRequestType.RESPONSE,
					sessionId: req.auth.sessionId,
					method:    method,
					urlPath:   req.originalUrl,
				});
			}

			return next(err);
		}
	};
}

function throttleSimilarRequestIsExclude (method: string, splittedEndpoint: string[], excludedSimilarThrottlingEndpoints: string[]) {
	let endpoint = '';
	const guidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
	for (const item of splittedEndpoint) {
		if (guidRegex.test(item)) {
			endpoint += '/@{guid}';
		} else if (item !== '') {
			endpoint += `/${item}`;
		}
	}
	const methodAndEndpointString = `${method} ${endpoint}`;
	return excludedSimilarThrottlingEndpoints.includes(methodAndEndpointString);
}

function generateResponseHash (data: any): string {
	// Создаём строку для хэша вида 'value1|value2|value3'
	let strToHash = '';
	for (const key of Object.keys(data)) {
		if (data[key]) {
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			strToHash += data[key].toString() + '|';
		} else {
			strToHash += 'null|';
		}
	}

	if (strToHash.length > 1 && strToHash.endsWith('|')) {
		strToHash = strToHash.slice(0, strToHash.length - 2);
	}

	// Создаём хэш из полученной строки
	const shasum = crypto.createHash('sha1');
	shasum.update(strToHash);

	return shasum.digest('hex');
}

function getIds (data?: any): IIdsType | undefined {
	if (!data) {
		return undefined;
	}

	const keysForLogging = Object.keys(data).filter((key) => {
		return key.length >= 3 && key.endsWith('Id');
	});

	if (!keysForLogging.length) {
		return undefined;
	}

	return keysForLogging.reduce<IIdsType>((acc, key) => {
		acc[key] = data[key];

		return acc;
	}, {});
}

interface IIdsType {
	[key: string]: string | null;
}
