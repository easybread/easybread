export function errObject<T extends string>(name: T): { readonly name: T };
export function errObject<T extends string, C>(
  name: T,
  cause: C,
): { readonly name: T; readonly cause: C };

export function errObject(name: string, cause?: unknown) {
  return cause ? ({ name, cause } as const) : ({ name } as const);
}
