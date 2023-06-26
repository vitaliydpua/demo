import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {MessageServiceClient} from 'rpc/lib/MessageServiceClient';


export class MessageController {

	constructor (
		private messageServiceClient: MessageServiceClient,
	) {}

	@handler({
		description: 'Show message and message body',
		method:      'GET',
		path:        '/messages/:messageId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.MESSAGE,
			action:   AuditAction.get,
		},
		cacheHeaders: {
			eTag: true,
		},
		validate: {
			params: {
				messageId: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					id:              joi.string().required(),
					counterpartyId:  joi.string().required(),
					type:            joi.string().required(),
					title:           joi.string().required(),
					description:     joi.string().required(),
					templateId:      joi.string().required(),
					data:            joi.object().required(),
					isPublished:     joi.boolean().required(),
					isRead:          joi.boolean().required(),
					isDeleted:       joi.boolean().required(),
					isVisibleToUser: joi.boolean().required(),
					icon:            joi.string(),
					publishFrom:     joi.date(),
					createdAt:       joi.date().required(),
					messageBody:     joi.string().required(),
				}),
			}),
		},
	})
	public async showMessage (req: RequestObj): Promise<object> {
		const showMessageBodyResult = await this.messageServiceClient.showMessageBody({
			counterpartyId: req.auth.counterpartyId!,
			messageId:      req.params.messageId,
			lg:             req.auth.lg!,
		});
		const message = await this.messageServiceClient.showMessage({
			messageId:  req.params.messageId,
			lg:         req.auth.lg!,
			markAsRead: true,
		});

		return {
			id:              message.id,
			counterpartyId:  message.counterpartyId,
			type:            message.type,
			title:           message.title,
			description:     message.description,
			templateId:      message.templateId,
			data:            message.data,
			isPublished:     message.isPublished,
			isRead:          message.isRead,
			isDeleted:       message.isDeleted,
			isVisibleToUser: message.isVisibleToUser,
			icon:            message.icon,
			publishFrom:     message.publishFrom,
			createdAt:       message.createdAt,
			messageBody:     showMessageBodyResult.messageBody,
		};
	}

	@handler({
		description: 'Delete message',
		method:      'DELETE',
		path:        '/messages/:messageId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.MESSAGE,
			action:   AuditAction.delete,
		},
		validate: {
			params: {
				messageId: joi.string().required(),
			},
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					messageId: joi.string().required(),
				}),
			}),
		},
	})
	public async deleteMessage (req: RequestObj): Promise<object> {
		const deleteMessageResult = await this.messageServiceClient.deleteMessage({
			counterpartyId: req.auth.counterpartyId!,
			messageId:      req.params.messageId,
		});

		return {
			messageId: deleteMessageResult.messageId,
		};
	}
}
