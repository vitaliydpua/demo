import { ModelFactory } from '../../../abstract/model-factory.abstract';

import { RequestProfileModel, RequestProfileModelData } from './request-profile.model';

export class RequestProfileFactory extends ModelFactory<RequestProfileModelData, RequestProfileModel> {
  protected getInstance(): RequestProfileModel {
    return new RequestProfileModel();
  }
}
