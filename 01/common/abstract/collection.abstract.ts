export abstract class CollectionAbstract<K, V> extends Map<K, V> {
  constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
    super(entries);
  }
  public getValues(): V[] {
    return Array.from(this.values());
  }

  public getKeys(): K[] {
    return Array.from(this.keys());
  }

  public getEntries(): Array<[K, V]> {
    return Array.from(this);
  }
}
