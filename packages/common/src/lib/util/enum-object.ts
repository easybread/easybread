export type EnumObject<TName extends readonly string[]> = {
  [K in TName[number]]: K;
};

export function enumObject<TName extends readonly string[]>(
  names: TName,
): EnumObject<TName> {
  return names.reduce(
    (res, key) => Object.assign(res, { [key]: key }),
    {} as EnumObject<TName>,
  );
}
