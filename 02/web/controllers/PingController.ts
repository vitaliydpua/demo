import joi from 'app/lib/app/Validator';
import {handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';


export class PingController {

	@handler({
		description: 'Simple ping',
		method:      'GET',
		path:        '/ping',
		auth:        DefaultAuthType.None,
		audit:       null,
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async simplePing (): Promise<object> {
		return {
			ping: 'pong',
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping',
		method:      'POST',
		path:        '/ping',
		auth:        DefaultAuthType.None,
		audit:       null,
		validate:    {
			body: joi.object().keys({
				str: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async postPing (): Promise<object> {
		return {
			ping: 'pong',
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping with required auth by session',
		method:      'GET',
		path:        '/ping/auth/session',
		auth:        AuthType.Session,
		audit:       null,
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					auth: joi.object(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async pingWithSession (req: RequestObj): Promise<object> {
		return {
			ping: 'pong',
			auth: req.auth,
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping with required auth by phone',
		method:      'GET',
		path:        '/ping/auth/phone',
		auth:        AuthType.Phone,
		audit:       null,
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					auth: joi.object(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async pingWithPhone (req: RequestObj): Promise<object> {
		return {
			ping: 'pong',
			auth: req.auth,
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping with required auth by user',
		method:      'GET',
		path:        '/ping/auth/user',
		auth:        AuthType.User,
		audit:       null,
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					auth: joi.object(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async pingWithUser (req: RequestObj): Promise<object> {
		return {
			ping: 'pong',
			auth: req.auth,
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping with required auth by signature',
		method:      'GET',
		path:        '/ping/auth/signature',
		auth:        AuthType.Signature,
		audit:       null,
		validate:    {
			query: joi.object().keys({
				var3: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					auth: joi.object(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async getPingWithSignature (req: RequestObj): Promise<object> {
		return {
			ping: 'pong',
			auth: req.auth,
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping with required auth by signature',
		method:      'POST',
		path:        '/ping/auth/signature',
		auth:        AuthType.Signature,
		audit:       null,
		validate:    {
			query: joi.object().keys({
				var3: joi.string(),
			}),
			body: joi.object().keys({
				var1: joi.string(),
				var2: joi.number(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					auth: joi.object(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async postPingWithSignature (req: RequestObj): Promise<object> {
		return {
			ping: 'pong',
			auth: req.auth,
			time: new Date().toISOString(),
		};
	}
}
