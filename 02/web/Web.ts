import express from 'express';
import http from 'http';
import {AddressInfo} from 'net';
import helmet from 'helmet';
import cors from 'cors';
import {Express, Request} from 'express';
import {AwilixContainer} from 'awilix';
import {IInterface} from 'app/lib/interfaces/interfaces.types';
import {Config} from '../../Config';
import {Logger} from 'app/lib/app/Logger';
import { ThrottleService } from '../../domain/throttle/ThrottleService';
import { RequestLogger } from '../../domain/requestLogger/RequestLogger';
import {registerLogger} from 'app/lib/interfaces/web/middlewares/logger';
import {registerErrorHandler} from 'app/lib/interfaces/web/middlewares/error-handler';
import {registerControllers} from './plugins/controllers';


export class Web implements IInterface {
	private readonly app: Express;
	private server!: http.Server;

	constructor (
		private logger: Logger,
		private config: Config,
		private container: AwilixContainer,
		private throttleService: ThrottleService,
		private requestLogger: RequestLogger,
		private authList: any[],
		private controllersList: any[],
	) {
		this.app = express();
	}

	public async init (): Promise<void> {
		this.app.locals.logger = this.logger;
		this.app.locals.config = this.config;
		this.app.locals.container = this.container;
		this.app.locals.throttleService = this.throttleService;
		this.app.locals.requestLogger = this.requestLogger;

		this.app.use(helmet());
		this.app.set('trust proxy', true);

		const origins = this.config.web.corsOrigin.split(';').map((it) => {
			return it.trim();
		});
		this.app.use(cors({
			origin:      origins.length === 1 ? origins[0] : origins,
			credentials: true,
		}));
		this.app.use(express.json({
			limit:  this.config.web.bodyLimit,
			verify: (req: Request, res: any, buf: Buffer, encoding: string) => {
				req.rawBody = buf;
			},
		}));

		this.app.use(express.urlencoded({ extended: true }));

		registerLogger(this.app);
		registerControllers(this.app, this.authList, this.controllersList);
		registerErrorHandler(this.app);
	}

	public async start (): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			this.logger.info(`web: starting ${this.config.web.port}`);

			this.server = this.app
			.listen(this.config.web.port)
			.on('listening', () => {
				const address = this.server.address() as AddressInfo;

				this.logger.info(`web: stared ${address.port}`);

				return resolve();
			})
			.on('error', (err) => {
				this.logger.error('web: failed');

				return reject(err);
			});
		});
	}

	public async stop (): Promise<void> {
		if (this.server) {
			this.logger.info('web: closing');
			this.server.close();
			this.logger.info('web: closed');
		}
	}

	public getPort (): number {
		const address = this.server.address() as AddressInfo;

		if (address) {
			return address.port;
		} else {
			return 0;
		}
	}
}
