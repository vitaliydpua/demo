import { UsersService } from '@inft-app/users/services/users.service';
import { UserByPhoneExistsError } from '@inft-common/error/custom-errors/users/user-by-phone-exists.error';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';


@ValidatorConstraint({ name: 'IsUniquePhoneNumberValidator', async: true })
@Injectable()
export class IsUniquePhoneNumberValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  public async validate(
    phoneNumber: string,
    _: ValidationArguments,
  ): Promise<boolean> {
    const exists = await this.usersService.userExistsByPhoneNumber(phoneNumber);

    if (exists) {
      throw new UserByPhoneExistsError();
    }

    return true;
  }
}
