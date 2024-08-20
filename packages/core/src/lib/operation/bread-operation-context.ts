import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import { EasyBreadClient } from '../client';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import { BreadStateAdapter } from '../state';
import { BreadHttpTransport } from '../transport/http';
import { BreadOperation } from './bread-operation';

interface BreadOperationContextOptions<
  TOperations extends BreadOperation<string>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> {
  readonly state: BreadStateAdapter;
  readonly client: EasyBreadClient<TOperations, TAuthStrategy, TOptions>;
  readonly auth: TAuthStrategy;
  readonly breadId: string;
}

export class BreadOperationContext<
  TOperation extends BreadOperation<string>,
  TAuthStrategy extends BreadAuthStrategy<object>,
  TOptions extends BreadServiceAdapterOptions | null = null
> {
  readonly state: BreadStateAdapter;
  readonly client: EasyBreadClient<TOperation, TAuthStrategy, TOptions>;
  readonly auth: TAuthStrategy;
  readonly http: BreadHttpTransport;
  readonly breadId: string;

  constructor({
    state,
    client,
    auth,
    breadId,
  }: BreadOperationContextOptions<TOperation, TAuthStrategy, TOptions>) {
    this.state = state;
    this.client = client;
    this.auth = auth;
    this.breadId = breadId;

    this.http = new BreadHttpTransport();
  }

  async httpRequest<T>(
    requestConfig: AxiosRequestConfig,
    skipAuthorization = false
  ): Promise<AxiosResponse<T>> {
    return this.http.request<T>(
      skipAuthorization
        ? requestConfig
        : await this.auth.authorizeHttp(this.breadId, requestConfig)
    );
  }

  async invoke<O extends TOperation>(input: O['input']): Promise<O['output']> {
    return this.client.invoke<O>(input);
  }

  // TODO: add graphql and other options
}
