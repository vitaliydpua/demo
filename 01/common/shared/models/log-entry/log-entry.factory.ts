import { ModelFactory } from '../../../abstract/model-factory.abstract';

import { LogEntryModel, LogEntryModelData } from './log-entry.model';

export class LogEntryFactory extends ModelFactory<LogEntryModelData, LogEntryModel> {
  protected getInstance(): LogEntryModel {
    return new LogEntryModel();
  }
}
