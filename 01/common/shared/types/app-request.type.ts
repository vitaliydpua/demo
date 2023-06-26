import { UserModel } from '@inft-app/users/models/user/user.model';
import { Request } from 'express';

export type AppRequest = Request & {
  user?: UserModel;
};
