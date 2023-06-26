import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {FileStorageClient} from 'rpc/lib/FileStorageClient';


export class FileController {

	constructor (
		private fileServiceClient: FileStorageClient,
	) {}

	@handler({
		description: 'Get a file from file storage',
		method:      'GET',
		path:        '/files/:fileId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.FILE,
			action:   AuditAction.get,
		},
		validate: {
			params: joi.object().keys({
				fileId: joi.string().guid().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:             joi.string().guid().required(),
					path:           joi.string(),
					extension:      joi.string(),
					mediaType:      joi.string(),
					counterpartyId: joi.string().guid(),
					data:           joi.string().base64(),
					createdAt:      joi.string().isoDate(),
				}),
			}),
		},
	})
	public async showFile (req: RequestObj): Promise<object> {
		const result = await this.fileServiceClient.showFileByIdAndCounterpartyId({
			fileId:         req.params.fileId,
			counterpartyId: req.auth.counterpartyId!,
		});

		return  {
			id:             result.id,
			path:           result.path,
			extension:      result.extension,
			mediaType:      result.mediaType,
			counterpartyId: result.counterpartyId,
			data:           result.data,
			createdAt:      result.createdAt,
		};
	}
}
