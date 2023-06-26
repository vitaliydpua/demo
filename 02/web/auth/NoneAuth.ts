import {Request} from 'express';
import {IAuth} from 'app/lib/interfaces/auth.types';


export class NoneAuth implements IAuth {

	public async credentials (req: Request): Promise<boolean> {
		return true;
	}

	public async auth (req: Request, credentials: boolean): Promise<Request['auth']> {
		return {};
	}
}
