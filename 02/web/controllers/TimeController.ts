import joi from 'app/lib/app/Validator';
import {handler} from '../decorators';
import {DefaultAuthType} from 'app/lib/interfaces/auth.types';


export class TimeController {

	@handler({
		description: 'Show unix timestamp',
		method:      'GET',
		path:        '/timestamp',
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
	public async showTimestamp (): Promise<object> {
		return {
			timestamp: Date.now(),
		};
	}
}
