export interface ActionHandler {
  handle(): Promise<void>;
}
