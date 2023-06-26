export enum Required {
  STRONG = 'strong',
  NULLABLE = 'nullable',
  OPTIONAL = 'optional'
}

export interface IPropStrategy {
  getDecorator(type?: any): Function;
}
