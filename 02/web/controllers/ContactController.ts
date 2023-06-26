import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {ContactServiceClient} from 'rpc/lib/ContactServiceClient';


export class ContactController {

	constructor (
		private contactServiceClient: ContactServiceClient,
	) {}

	@handler({
		description: 'Add contact',
		method:      'POST',
		path:        '/contacts',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT,
			action:   AuditAction.create,
		},
		validate: {
			body: joi.object().keys({
				fullName: joi.string().required(),
				rawPhone: joi.string(),
				avatar:   joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					contactId: joi.string().required(),
				}),
			}),
		},
	})
	public async addContact (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.createContact({
			counterpartyId: req.auth.counterpartyId!,
			fullName:       req.body.fullName,
			rawPhone:       req.body.rawPhone,
			avatar:         req.body.avatar,
		});

		return {
			contactId: result.contactId,
		};
	}

	@handler({
		description: 'Update contact',
		method:      'PATCH',
		path:        '/contacts/:contactId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT,
			action:   AuditAction.modify,
		},
		validate: {
			params: joi.object().keys({
				contactId: joi.string().required(),
			}),
			body: joi.object().keys({
				fullName: joi.string(),
				rawPhone: joi.string(),
				avatar:   joi.string(),
			}).or('fullName', 'rawPhone', 'avatar'),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					contactId: joi.string().required(),
				}),
			}),
		},
	})
	public async updateContact (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.updateContact({
			contactId:      req.params.contactId,
			counterpartyId: req.auth.counterpartyId!,
			fullName:       req.body.fullName,
			rawPhone:       req.body.rawPhone,
			avatar:         req.body.avatar,
		});

		return {
			contactId: result.contactId,
		};
	}

	@handler({
		description: 'Delete contact with cards by id',
		method:      'DELETE',
		path:        '/contacts/:contactId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT,
			action:   AuditAction.delete,
		},
		validate: {
			params: joi.object().keys({
				contactId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					contactId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async deleteContactWithCards (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.deleteContactWithCards({
			counterpartyId: req.auth.counterpartyId!,
			contactId:      req.params.contactId,
		});

		return {
			contactId: result.contactId,
		};
	}

	@handler({
		description: 'Show Contacts List by counterpartyId',
		method:      'GET',
		path:        '/contacts',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT,
			action:   AuditAction.getList,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							contactId: joi.string().required(),
							fullName:  joi.string().required(),
							rawPhone:  joi.string().required().allow(null),
							avatarUrl: joi.string().required().allow(null),
						}),
					),
				}),
			}),
		},
	})
	public async listContacts (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.listContacts({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((contact) => {
				return {
					contactId: contact.contactId,
					fullName:  contact.fullName,
					rawPhone:  contact.rawPhone,
					avatarUrl: contact.avatarUrl,
				};
			}),
		};
	}

	@handler({
		description: 'Add card to contact',
		method:      'POST',
		path:        '/contacts/:contactId/cards',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT_CARD,
			action:   AuditAction.create,
		},
		validate: {
			params: joi.object().keys({
				contactId: joi.string().required(),
			}),
			body: joi.object().keys({
				cardId: joi.string().guid().required(),
				name:   joi.string().allow('').allow(null),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					cardId:    joi.string().guid().required(),
					contactId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async addCardToContact (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.addCardToContact({
			counterpartyId: req.auth.counterpartyId!,
			contactId:      req.params.contactId,
			cardId:         req.body.cardId,
			name:           req.body.name,
		});

		return {
			cardId:    result.cardId,
			contactId: result.contactId,
		};
	}

	@handler({
		description: 'Update contact card',
		method:      'PATCH',
		path:        '/contacts/:contactId/cards/:cardId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT_CARD,
			action:   AuditAction.modify,
		},
		validate: {
			params: joi.object().keys({
				contactId: joi.string().required(),
				cardId:    joi.string().required(),
			}),
			body: joi.object().keys({
				name: joi.string().allow(null).allow('').required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					contactId: joi.string().guid().required(),
					cardId:    joi.string().guid().required(),
				}),
			}),
		},
	})
	public async updateContactCard (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.updateContactCard({
			counterpartyId: req.auth.counterpartyId!,
			contactId:      req.params.contactId,
			cardId:         req.params.cardId,
			name:           req.body.name,
		});

		return {
			contactId: result.contactId,
			cardId:    result.cardId,
		};
	}

	@handler({
		description: 'Show active card by CounterpartyId',
		method:      'GET',
		path:        '/contacts/cards',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT_CARD,
			action:   AuditAction.getActiveCard,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							contactId:   joi.string().required(),
							cardId:      joi.string().required(),
							cardName:    joi.string().allow(null).allow('').required(),
							firstDigits: joi.string().required(),
							lastDigits:  joi.string().required(),
						}),
					).required(),
				}),
			}),
		},
	})
	public async listActiveCardsOfContacts (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.listActiveCardsOfContacts({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((it) => {
				return {
					contactId:   it.contactId,
					cardId:      it.cardId,
					cardName:    it.cardName,
					firstDigits: it.firstDigits,
					lastDigits:  it.lastDigits,
				};
			}),
		};
	}

	@handler({
		description: 'Delete card from contact',
		method:      'DELETE',
		path:        '/contacts/:contactId/cards/:cardId',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CONTACT_CARD,
			action:   AuditAction.delete,
		},
		validate: {
			params: joi.object().keys({
				contactId: joi.string().required(),
				cardId:    joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					contactId: joi.string().guid().required(),
					cardId:    joi.string().guid().required(),
				}),
			}),
		},
	})
	public async deleteContactCard (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.deleteContactCard({
			counterpartyId: req.auth.counterpartyId!,
			contactId:      req.params.contactId,
			cardId:         req.params.cardId,
		});

		return {
			contactId: result.contactId,
			cardId:    result.cardId,
		};
	}

	@handler({
		description: 'Update PhoneBookContact',
		method:      'PATCH',
		path:        '/phone-book/contacts/:phoneBookContactId',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PHONEBOOK_CONTACT,
			action:   AuditAction.modify,
		},
		validate: {
			params: joi.object().keys({
				phoneBookContactId: joi.string().required(),
			}),
			body: joi.object().keys({
				fullName: joi.string().required(),
				avatar:   joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					phoneBookContactId: joi.string().guid().required(),
				}),
			}),
		},
	})
	public async updatePhoneBookContact (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.updatePhoneBookContact({
			counterpartyId:     req.auth.counterpartyId!,
			phoneBookContactId: req.params.phoneBookContactId,
			fullName:           req.body.fullName,
			avatar:             req.body.avatar,
		});

		return {
			phoneBookContactId: result.phoneBookContactId,
		};
	}

	@handler({
		description: 'Sync contacts list (Upsert) to PhoneBookContacts',
		method:      'PUT',
		path:        '/phone-book/contacts',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PHONEBOOK_CONTACT,
			action:   AuditAction.sync,
		},
		validate: {
			body: joi.object().keys({
				phones: joi.array().items(joi.string()).required(),
			}),
		},
		response: {},
	})
	public async createPhoneBookContacts (req: RequestObj): Promise<object> {
		await this.contactServiceClient.createPhoneBookContacts({
			counterpartyId: req.auth.counterpartyId!,
			phones:         req.body.phones,
		});

		return {};
	}

	@handler({
		description: 'Update phone book contacts',
		method:      'PATCH',
		path:        '/phone-book/contacts',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PHONEBOOK_CONTACT,
			action:   AuditAction.sync,
		},
		validate: {
			body: joi.object().keys({
				phoneBookContacts: joi.array().items(joi.object().keys({
					phoneBookContactId: joi.string().guid().required(),
					fullName:           joi.string().required(),
					avatar:             joi.string(),
				})).required(),
			}),
		},
		response: {},
	})
	public async updateListPhoneBookContacts (req: RequestObj): Promise<object> {
		await this.contactServiceClient.updateListPhoneBookContacts({
			counterpartyId:    req.auth.counterpartyId!,
			phoneBookContacts: req.body.phoneBookContacts,
		});

		return {};
	}

	@handler({
		description: 'Show List PhoneBookContacts by counterpartyId',
		method:      'GET',
		path:        '/phone-book/contacts',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.PHONEBOOK_CONTACT,
			action:   AuditAction.getList,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					total: joi.number().required(),
					items: joi.array().items(
						joi.object().keys({
							phoneBookContactId: joi.string().required(),
							phone:              joi.string().required(),
							fullName:           joi.string().required().allow(null),
							avatarUrl:          joi.string().required().allow(null),
							lastDigits:         joi.string().required(),
						}),
					),
				}),
			}),
		},
	})
	public async listPhoneBookContacts (req: RequestObj): Promise<object> {
		const result = await this.contactServiceClient.listPhoneBookContacts({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			total: result.total,
			items: result.items.map((phoneBookContact) => {
				return {
					phoneBookContactId: phoneBookContact.phoneBookContactId,
					phone:              phoneBookContact.phone,
					fullName:           phoneBookContact.fullName,
					avatarUrl:          phoneBookContact.avatarUrl,
					lastDigits:         phoneBookContact.lastDigits,
				};
			}),
		};
	}
}
