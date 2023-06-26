import { makeDynamicProperties } from '../helpers/dynamic-properties.helper';

export abstract class ModelFactory<D, M> {
  public getModelFromData(data: D): M {
    const instance = this.getInstance(data);
    // @ts-ignore
    makeDynamicProperties<M>(instance, data);
    return instance;
  }

  protected abstract getInstance(data: D): M;
}
