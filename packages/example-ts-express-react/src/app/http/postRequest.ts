import { makeAxiosRequest } from './makeAxiosRequest';

export async function postRequest<TData, TResult>(
  url: string,
  data: TData
): Promise<TResult> {
  return makeAxiosRequest<TResult>({
    method: 'POST',
    url,
    data
  });
}
