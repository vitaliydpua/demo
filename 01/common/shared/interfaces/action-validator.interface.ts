export interface ActionValidator {
  validate(): void;
}

export interface ActionValidatorAsync {
  validate(): Promise<void>;
}
