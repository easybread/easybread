import { makeAxiosRequest } from './makeAxiosRequest';

export async function putRequest<TData, TResult>(
  url: string,
  data: TData
): Promise<TResult> {
  return makeAxiosRequest<TResult>({
    method: 'PUT',
    url,
    data
  });
}
