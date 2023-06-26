export function makeDynamicProperties<M>(objTo: M, data?: { [P in keyof M]?: M[P] }): void {
  if (data) {
    Object.keys(data).map((propertyName: string) => {
      const currentPropDescriptor = Object.getOwnPropertyDescriptor(objTo, propertyName);
      if (!currentPropDescriptor) {
        const newPropDescriptor = {
          writable: false,
          configurable: true,
          enumerable: true,
          value: data[propertyName],
        };

        Object.defineProperty(objTo, propertyName, newPropDescriptor);
      } else {
        objTo[propertyName] = data[propertyName];
      }
    });
  }
}
