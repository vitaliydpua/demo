import joi from 'app/lib/app/Validator';
import {AuditAction, AuditCategory, handler} from '../decorators';
import {RequestObj} from 'app/lib/interfaces/decorators';
import {AuthType} from '../auth/auth.types';
import {BankingServiceClient} from 'rpc/lib/BankingServiceClient';
import {Dictionary} from 'app/lib/dictionary/Dictionary';
import { CrmServiceClient } from 'rpc/lib/CrmServiceClient';

export class BankingController {

	constructor (
		private bankingServiceClient: BankingServiceClient,
		private crmServiceClient: CrmServiceClient,
	) {}

	@handler({
		description: 'Get info about counterparty and documents',
		method:      'GET',
		path:        '/banking/counterparty/me/info',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.COUNTERPARTY,
			action:   AuditAction.getCounterpartyInfo,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					livingAddress:  joi.string().allow(null).required(),
					status:         joi.string().required(),
					cardholderName: joi.string().allow(null).required(),
					createdAt:      joi.date().required(),
				}),
			}),
		},
	})
	public async showCounterpartyInfo (req: RequestObj): Promise<object> {
		const result = await this.bankingServiceClient.showCounterpartyInfo({
			counterpartyId: req.auth.counterpartyId!,
		});

		return {
			livingAddress:  result.livingAddress,
			status:         result.status,
			cardholderName: result.cardholderName,
			createdAt:      result.createdAt,
		};
	}

	@handler({
		description: 'Get account requisites',
		method:      'GET',
		path:        '/accounts/:cardId/requisites',
		auth:        AuthType.Signature,
		audit:       {
			category: AuditCategory.ACCOUNT,
			action:   AuditAction.getAccountRequisites,
		},
		validate: {
			params: joi.object().keys({
				cardId: joi.string().required(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					bankName:      joi.string().required(),
					mfo:           joi.string().required(),
					firstName:     joi.string().required(),
					lastName:      joi.string().required(),
					patronymic:    joi.string().required().allow(null),
					iban:          joi.string().required(),
					accountNumber: joi.string().required(),
					edrpou:        joi.string().required(),
				}),
			}),
		},
	})
	public async showAccountRequisites (req: RequestObj): Promise<object> {
		const result = await this.bankingServiceClient.showAccountRequisites({
			counterpartyId: req.auth.counterpartyId!,
			cardId:         req.params.cardId,
		});

		return {
			bankName:      result.bankName,
			mfo:           result.mfo,
			firstName:     result.firstName,
			lastName:      result.lastName,
			patronymic:    result.patronymic,
			iban:          result.iban,
			accountNumber: result.accountNumber,
			edrpou:        result.edrpou,
		};
	}

	@handler({
		description: 'Get counterparty documents',
		method:      'GET',
		path:        '/banking/counterparty/me/documents',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.COUNTERPARTY,
			action:   AuditAction.getCounterpartyDocuments,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					hasUnconfirmedDocuments: joi.boolean().required(),
					firstName:               joi.string().required(),
					lastName:                joi.string().required(),
					patronymic:              joi.string().required(),
					taxId:                   joi.string().required(),
					passportData:            joi.object().keys({
						series:   joi.string().allow(null).required(),
						number:   joi.string().allow(null).required(),
						issuedAt: joi.string().allow(null).required(),
						issuedBy: joi.string().allow(null).required(),
					}).required(),
					passportIdData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).required(),
					foreignPassportData: joi.object().keys({
						recordNumber: joi.string().allow(null).required(),
						series:       joi.string().allow(null).required(),
						number:       joi.string().allow(null).required(),
						issuedAt:     joi.string().allow(null).required(),
						issuedBy:     joi.string().allow(null).required(),
						validUntil:   joi.string().allow(null).required(),
					}).required(),
					birthDate:           joi.string().required(),
					placeOfBirth:        joi.string().required(),
					registrationAddress: joi.object().keys({
						zip:       joi.string().required(),
						country:   joi.string().required(),
						region:    joi.string().allow(null).required(),
						district:  joi.string().allow(null).required(),
						city:      joi.string().required(),
						street:    joi.string().required(),
						house:     joi.string().required(),
						corps:     joi.string().required(),
						apartment: joi.string().required(),
					}),
				}),
			}),
		},
	})
	public async showCounterpartyDocuments (req: RequestObj): Promise<object> {
		const result = await this.bankingServiceClient.showCounterpartyDocuments({
			counterpartyId: req.auth.counterpartyId!,
		});

		const passportData = result.passportData ? {
			series:   result.passportData.series,
			number:   result.passportData.number,
			issuedAt: result.passportData.issuedAt,
			issuedBy: result.passportData.issuedBy,
		} : null;

		const passportIdData = result.passportIdData ? {
			recordNumber: result.passportIdData.recordNumber,
			number:       result.passportIdData.number,
			issuedAt:     result.passportIdData.issuedAt,
			issuedBy:     result.passportIdData.issuedBy,
			validUntil:   result.passportIdData.validUntil,
		} : null;

		const foreignPassportData = result.foreignPassportData ? {
			recordNumber: result.foreignPassportData.recordNumber,
			series:       result.foreignPassportData.series,
			number:       result.foreignPassportData.number,
			issuedAt:     result.foreignPassportData.issuedAt,
			issuedBy:     result.foreignPassportData.issuedBy,
			validUntil:   result.foreignPassportData.validUntil,
		} : null;

		const dictAddress = result.registrationAddress ? await this.crmServiceClient.showDictAddress({cityId: Number(result.registrationAddress.cityId)}) : null;

		let registrationAddress = null;
		if (result.registrationAddress && dictAddress) {
			let region;
			let district;

			if (dictAddress.cityAdministrativeCentreType === 'REGION') { // для областных центров не выводим область и район
				region = null;
				district = null;
			} else if (dictAddress.cityAdministrativeCentreType === 'DISTRICT') { // для районных центров не выводим район
				region = `${dictAddress.region} обл.`;
				district = null;
			} else {
				region = `${dictAddress.region} обл.`;
				district = `${dictAddress.district} р-н`;
			}

			const cityType = result.registrationAddress.cityTypeId ? Dictionary.toCityType(result.registrationAddress.cityTypeId) : null;
			const city = cityType ? `${Dictionary.toCityTypeTitle(cityType)} ${dictAddress.city}` : dictAddress.city;

			const streetType = result.registrationAddress.streetTypeId ? Dictionary.toStreetType(result.registrationAddress.streetTypeId) : null;
			const street = streetType ? `${Dictionary.toStreetTypeTitle(streetType)} ${result.registrationAddress.street}` : result.registrationAddress.street;

			const houseType = result.registrationAddress.houseTypeId ? Dictionary.toHouseType(result.registrationAddress.houseTypeId) : null;
			const house = houseType ? `${Dictionary.toHouseTypeTitle(houseType)} ${result.registrationAddress.house}` : result.registrationAddress.house;

			const apartmentType = result.registrationAddress.apartmentTypeId ? Dictionary.toApartmentType(result.registrationAddress.apartmentTypeId) : null;
			const apartment = apartmentType ? `${Dictionary.toApartmentTypeTitle(apartmentType)} ${result.registrationAddress.apartment}` : result.registrationAddress.apartment;

			registrationAddress = {
				zip:       result.registrationAddress.zip,
				country:   dictAddress.country,
				region:    region,
				district:  district,
				city:      city,
				street:    street,
				house:     house,
				corps:     result.registrationAddress.corps,
				apartment: apartment,
			};
		}

		return {
			hasUnconfirmedDocuments: result.hasUnconfirmedDocuments,
			firstName:               result.firstName,
			lastName:                result.lastName,
			patronymic:              result.patronymic,
			passportData:            passportData,
			passportIdData:          passportIdData,
			foreignPassportData:     foreignPassportData,
			taxId:                   result.taxId,
			birthDate:               result.birthDate,
			placeOfBirth:            result.placeOfBirth,
			registrationAddress:     registrationAddress,
		};
	}

	@handler({
		description: 'Get last currency rates',
		method:      'GET',
		path:        '/currency-rates',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CURRENCY_RATES,
			action:   AuditAction.get,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					usdUahPurchase: joi.string().required(),
					usdUahSale:     joi.string().required(),
					usdUahNbu:      joi.string().required(),
					eurUahPurchase: joi.string().required(),
					eurUahSale:     joi.string().required(),
					eurUahNbu:      joi.string().required(),
				}),
			}),
		},
	})
	public async getLastCurrencyRates (): Promise<object> {
		const result = await this.bankingServiceClient.getLastCurrencyRates({});

		return {
			usdUahPurchase: result.usdUahPurchase,
			usdUahSale:     result.usdUahSale,
			usdUahNbu:      result.usdUahNbu,
			eurUahPurchase: result.eurUahPurchase,
			eurUahSale:     result.eurUahSale,
			eurUahNbu:      result.eurUahNbu,
		};
	}

	@handler({
		description: 'Get last user currencies matrix for converter',
		method:      'GET',
		path:        '/currency-rates/matrix',
		auth:        AuthType.User,
		audit:       {
			category: AuditCategory.CURRENCY_RATES,
			action:   AuditAction.get,
		},
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					currencies: joi.array().items(joi.string()).required(),
					matrix:     joi.array().items(joi.array().items(joi.string())).required(),
					order:      joi.array().items(joi.string()).required(),
				}),
			}),
		},
	})
	public async getUserCurrenciesRatesMatrix (): Promise<object> {
		const result = await this.bankingServiceClient.getUserCurrenciesRatesMatrix({});

		return {
			currencies: result.currencies,
			matrix:     result.matrix,
			order:      result.order,
		};
	}
}
