export abstract class ConfigProvider<T> {
  abstract getConfig(): T;
}
