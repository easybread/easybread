export type FormDataValue = string | Blob | number | boolean | null | undefined;

function setValue(fd: FormData, key: string, value: FormDataValue) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    fd.append(key, `${value}`);
    return;
  }

  if (typeof value === 'string') {
    fd.append(key, value);
    return;
  }

  if (value instanceof Blob) {
    fd.append(key, value);
    return;
  }
}

export function toFormData(
  data: Record<string, FormDataValue | FormDataValue[]>
) {
  const fd = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((v) => setValue(fd, key, v));
      continue;
    }

    setValue(fd, key, value);
  }

  return fd;
}
