import { AxiosError, type AxiosResponse } from 'axios';
type CreateAxiosErrorResponse = Partial<AxiosResponse> & { status: number };

const DEFAULT_RESPONSE = {
  status: 500,
  statusText: 'Artificial Test Error',
  data: {},
  headers: {},
} satisfies CreateAxiosErrorResponse;

export function createAxiosError(
  errorMessage: string,
  response: CreateAxiosErrorResponse = { ...DEFAULT_RESPONSE }
) {
  return new AxiosError(
    errorMessage,
    'TEST_CODE',
    {} as any,
    {},
    {
      config: {} as any,
      ...DEFAULT_RESPONSE,
      ...response,
    }
  );
}
