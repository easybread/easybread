import { AxiosRequestConfig } from 'axios';

import { NoAuthDataException } from '../exception';
import { BreadStateAdapter } from '../state';
import { BreadHttpTransport } from '../transport/http';
import { BreadEventBus } from '../event-bus/bread-event.bus';
import type { BreadAuthStrategyEvent } from './events/bread.auth-strategy.event';

export abstract class BreadAuthStrategy<
  TStateData extends object
> extends BreadEventBus<BreadAuthStrategyEvent> {
  readonly http: BreadHttpTransport;

  protected constructor(
    protected readonly state: BreadStateAdapter,
    protected readonly provider: string
  ) {
    if (!provider) throw new Error('provider is not specified');

    super();

    this.http = new BreadHttpTransport();
  }

  async readAuthData(breadId: string): Promise<TStateData> {
    const authData = await this.state.read<TStateData>(
      this.createAuthDataStateKey(breadId)
    );

    if (!authData) throw new NoAuthDataException(breadId);

    return authData;
  }

  public async unAuthenticate(breadId: string): Promise<void> {
    await this.clearAuthData(breadId);
    // subclass might decide to do something else on top of this.
  }

  protected createAuthDataStateKey(breadId: string): string {
    return `${this.provider}:auth-data:${breadId}`;
  }

  protected async writeAuthData(
    breadId: string,
    data: TStateData
  ): Promise<void> {
    await this.state.write<TStateData>(
      this.createAuthDataStateKey(breadId),
      data
    );
  }

  protected async clearAuthData(breadId: string): Promise<void> {
    await this.state
      .remove(this.createAuthDataStateKey(breadId))
      .catch((_) => undefined);
  }

  protected setHeaders(
    requestConfig: AxiosRequestConfig,
    headers: Partial<AxiosRequestConfig['headers']>
  ): AxiosRequestConfig {
    return {
      ...requestConfig,
      headers: this.mergeHeaders(requestConfig.headers, headers),
    };
  }

  protected addAuthorizationHeader(
    requestConfig: AxiosRequestConfig,
    authorization: string
  ): AxiosRequestConfig {
    return this.setHeaders(requestConfig, { authorization });
  }

  protected mergeHeaders(
    originalHeaders: object | undefined,
    newHeaders: object | undefined
  ): Record<string, string> {
    return {
      ...(originalHeaders ?? {}),
      ...(newHeaders ?? {}),
    };
  }

  protected toBase64(input: string): string {
    return Buffer.from(input).toString('base64');
  }

  abstract authenticate(breadId: string, payload?: object): Promise<unknown>;

  abstract authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig>;

  // TODO: authorization for graphql
}
