import {Express} from 'express';
import { ThrottleService } from '../../../domain/throttle/ThrottleService';

export function registerThrottler (app: Express): void {
	app.use(async (req, res, next: (err?: any) => void) => {
		try {
			// пропускаємо запити ProbeController
			if (req.path.includes('/_probe')) {
				return next();
			}
			await (app.locals.throttleService as ThrottleService).globalThrottle(req.ip); // IP is used as identification for this interface
		} catch (error: any) {
			return next(error);
		}
		return next();
	});
}
