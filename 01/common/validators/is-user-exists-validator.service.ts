import { UsersService } from '@inft-app/users/services/users.service';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UUID } from "@inft-common/shared/types/uuid.type";


@ValidatorConstraint({ name: 'IsUserExistsValidator', async: true })
@Injectable()
export class IsUserExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  public async validate(
    userId: UUID,
    _: ValidationArguments,
  ): Promise<boolean> {
    const user = await this.usersService.getUserById(userId);
    return Boolean(user);
  }
}
