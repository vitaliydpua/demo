import { UsersService } from '@inft-app/users/services/users.service';
import { UserByEmailExistsError } from '@inft-common/error/custom-errors/users/user-by-email-exists.error';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


@ValidatorConstraint({ name: 'IsUniqueEmailValidator', async: true })
@Injectable()
export class IsUniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  public async validate(
    email: string,
    _: ValidationArguments,
  ): Promise<boolean> {
    const exists = await this.usersService.userExistsByEmail(email);

    if (exists) {
      throw new UserByEmailExistsError();
    }

    return true;
  }
}
