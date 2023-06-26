import { InvalidPhoneFormatError } from '@inft-common/error/custom-errors/common/invalid-phone-format.error';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import parsePhoneNumber from 'libphonenumber-js';


@ValidatorConstraint({ name: 'PhoneNumberFormatValidator' })
@Injectable()
export class PhoneNumberFormatValidator implements ValidatorConstraintInterface {
  public validate(
    phoneNumber: string,
    _: ValidationArguments,
  ): boolean {
    const phone = parsePhoneNumber(`+${phoneNumber}`);
    const valid = phone && phone.isValid();

    if (!valid) {
      throw new InvalidPhoneFormatError();
    }

    return valid;
  }
}
