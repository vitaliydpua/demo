export abstract class ModelDataMapper<D, M> {
  abstract mapData(data: D): M;
}
