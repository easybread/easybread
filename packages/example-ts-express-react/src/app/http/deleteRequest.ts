import { makeAxiosRequest } from './makeAxiosRequest';

export async function deleteRequest<TResult>(url: string): Promise<TResult> {
  return makeAxiosRequest<TResult>({
    method: 'DELETE',
    url
  });
}
