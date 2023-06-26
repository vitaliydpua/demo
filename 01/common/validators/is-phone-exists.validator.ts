import { UsersService } from '@inft-app/users/services/users.service';
import { UserByPhoneNotExistsError } from '@inft-common/error/custom-errors/users/user-by-phone-not-exists.error';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


@ValidatorConstraint({ name: 'IsPhoneExistsValidator', async: true })
@Injectable()
export class IsPhoneExistsValidator implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) {}

    async validate(phoneNumber: string, _: ValidationArguments): Promise<boolean> {
        const phoneExists = await this.usersService.userExistsByPhoneNumber(phoneNumber);

        if (!phoneExists) {
            throw new UserByPhoneNotExistsError();
        }

        return phoneExists;
    }
}
