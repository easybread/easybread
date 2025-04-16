import type { FormDataValue } from './to-form-data';

export type SearchParamsValue = string | number | boolean | null | undefined;

function setValue(params: URLSearchParams, key: string, value: FormDataValue) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    params.append(key, `${value}`);
    return;
  }

  if (typeof value === 'string') {
    params.append(key, value);
    return;
  }
}

export function injectIntoUrlSearchParams(
  target: URLSearchParams = new URLSearchParams(),
  data: Record<string, SearchParamsValue | SearchParamsValue[]>,
) {
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach(v => setValue(target, key, v));
      continue;
    }

    setValue(target, key, value);
  }

  return target;
}
