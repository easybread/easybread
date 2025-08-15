const _TAG = Symbol('tag');

export type Tag<T extends string> = {
  readonly [_TAG]: T;
};

export function tagged<T extends string, V extends object>(
  tag: T,
  value: V = {} as V,
): Tag<T> & V {
  if (typeof value !== 'object' && value === null) {
    throw new Error('Value must be an object');
  }

  return { [_TAG]: tag, ...value };
}

export function isTagged<T extends string>(
  value: any,
  tag: T,
): value is Tag<T> {
  return typeof value === 'object' && value !== null && value[_TAG] === tag;
}
