import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import { BreadStateAdapter } from '../state';
import { BreadHttpTransport } from '../transport/http';

interface BreadOperationContextOptions<
  TAuth extends BreadAuthStrategy<object>
> {
  readonly breadId: string;
  readonly state: BreadStateAdapter;
  readonly auth: TAuth;
}

export class BreadOperationContext<TAuth extends BreadAuthStrategy<object>> {
  readonly auth: TAuth;
  readonly state: BreadStateAdapter;
  readonly http: BreadHttpTransport;
  readonly breadId: string;

  constructor({ state, auth, breadId }: BreadOperationContextOptions<TAuth>) {
    this.state = state;
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
}
