import { UserModel } from '@inft-app/users/models/user/user.model';
import { EUserRole } from '@inft-common/shared/enums/user-role.enum';
import { AppRequest } from '@inft-common/shared/types/app-request.type';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: EUserRole[]) => applyDecorators(
  SetMetadata('roles', roles),
  UseGuards(RolesGuard)
);


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<EUserRole[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest<AppRequest>().user as UserModel;

    return roles.includes(user?.role);
  }
}
