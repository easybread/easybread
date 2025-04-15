import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { AuthStrategy } from '../auth-strategy';
import { StateAdapter } from '../state';
import { HttpTransport } from '../transport/http';

interface CommandContextOptions<TAuth extends AuthStrategy<object>> {
  readonly breadId: string;
  readonly state: StateAdapter;
  readonly auth: TAuth;
  readonly provider: string;
}

export class CommandContext<TAuth extends AuthStrategy<object>> {
  readonly auth: TAuth;
  readonly state: StateAdapter;
  readonly http: HttpTransport;
  readonly breadId: string;
  readonly provider: string;

  constructor({
    state,
    auth,
    breadId,
    provider,
  }: CommandContextOptions<TAuth>) {
    this.state = state;
    this.auth = auth;
    this.breadId = breadId;
    this.provider = provider;

    this.http = new HttpTransport();
  }

  async httpRequest<T>(
    requestConfig: AxiosRequestConfig,
    skipAuthorization = false,
  ): Promise<AxiosResponse<T>> {
    return this.http.request<T>(
      skipAuthorization
        ? requestConfig
        : await this.auth.authorizeHttp(this.breadId, requestConfig),
    );
  }
}
