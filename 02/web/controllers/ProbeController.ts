import joi from 'app/lib/app/Validator';
import {handler} from '../decorators';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';


export class ProbeController {

	@handler({
		description: 'Liveness probe',
		method:      'GET',
		path:        '/_probe/live',
		auth:        DefaultAuthType.None,
		audit:       null,
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ok: joi.boolean(),
				}),
			}),
		},
	})
	public async liveness (): Promise<object> {
		return {
			ok: true,
		};
	}

	@handler({
		description: 'Readiness probe',
		method:      'GET',
		path:        '/_probe/ready',
		auth:        DefaultAuthType.None,
		audit:       null,
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ok: joi.boolean(),
				}),
			}),
		},
	})
	public async readiness (): Promise<object> {
		return {
			ok: true,
		};
	}
}
