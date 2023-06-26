import * as moment from 'moment';

import { RequestProfileModel } from '../request-profile/request-profile.model';
import { ResponseProfileModel } from '../response-profile/response-profile.model';

export interface LogEntryModelData {
  request?: RequestProfileModel;
  response?: ResponseProfileModel;
  requestDate?: moment.Moment;
  responseDate?: moment.Moment;
  executionTimeInMilliseconds?: number;
}

export interface LogEntryModel extends LogEntryModelData {}

export class LogEntryModel {}
