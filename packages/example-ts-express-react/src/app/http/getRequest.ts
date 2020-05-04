import { makeAxiosRequest } from './makeAxiosRequest';

export async function getRequest<TResult>(
  url: string,
  query: object = {}
): Promise<TResult> {
  return makeAxiosRequest<TResult>({
    method: 'GET',
    url,
    params: query
  });
}
