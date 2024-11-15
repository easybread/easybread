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

export function toUrlSearchParams(
  data: Record<string, SearchParamsValue | SearchParamsValue[]>,
  params: URLSearchParams = new URLSearchParams()
) {
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((v) => setValue(params, key, v));
      continue;
    }

    setValue(params, key, value);
  }

  return params;
}
