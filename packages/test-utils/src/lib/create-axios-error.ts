import { AxiosError, type AxiosResponse } from 'axios';

export function createAxiosError(
  errorMessage: string,
  response: Partial<AxiosResponse> & { status: number }
) {
  return new AxiosError(
    errorMessage,
    'TEST_CODE',
    {} as any,
    {},
    {
      config: {} as any,
      statusText: 'Artificial Test Error',
      headers: {},
      data: '',
      ...response,
    }
  );
}
