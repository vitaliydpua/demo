import { UsersService } from '@inft-app/users/services/users.service';
import { UserByEmailNotExistsError } from '@inft-common/error/custom-errors/users/user-by-email-not-exists.error';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


@ValidatorConstraint({ name: 'IsEmailExistsValidator', async: true })
@Injectable()
export class IsEmailExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  public async validate(
    email: string,
    _: ValidationArguments,
  ): Promise<boolean> {
    const exists = await this.usersService.userExistsByEmail(email);

    if (!exists) {
      throw new UserByEmailNotExistsError();
    }

    return true;
  }
}
