import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import { EasyBreadClient } from '../client';
import { BreadStateAdapter } from '../state';
import { BreadHttpTransport } from '../transport/http';
import { BreadOperation } from './bread-operation';

interface BreadOperationContextOptions<
  T extends BreadOperation<string>,
  A extends BreadAuthStrategy<object>
> {
  readonly state: BreadStateAdapter;
  readonly client: EasyBreadClient<T, A>;
  readonly auth: A;
  readonly breadId: string;
}

export class BreadOperationContext<
  T extends BreadOperation<string>,
  A extends BreadAuthStrategy<object>
> {
  readonly state: BreadStateAdapter;
  readonly client: EasyBreadClient<T, A>;
  readonly auth: A;
  readonly http: BreadHttpTransport;
  readonly breadId: string;

  constructor({
    state,
    client,
    auth,
    breadId
  }: BreadOperationContextOptions<T, A>) {
    this.state = state;
    this.client = client;
    this.auth = auth;
    this.breadId = breadId;

    this.http = new BreadHttpTransport();
  }

  async httpRequest<T>(
    requestConfig: AxiosRequestConfig,
    skipAuthorization: boolean = false
  ): Promise<AxiosResponse<T>> {
    return this.http.request<T>(
      skipAuthorization
        ? requestConfig
        : await this.auth.authorizeHttp(this.breadId, requestConfig)
    );
  }

  async invoke<O extends T>(input: O['input']): Promise<O['output']> {
    return this.client.invoke<O>(input);
  }

  // TODO: add graphql and other options
}
