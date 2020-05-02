import { makeAxiosRequest } from './makeAxiosRequest';

export async function getRequest<TResult>(url: string): Promise<TResult> {
  return makeAxiosRequest<TResult>({
    method: 'GET',
    url
  });
}
