import { AxiosRequestConfig } from 'axios';
import { randomBytes } from 'node:crypto';

import { BreadEventBus } from '../event-bus/bread-event.bus';
import {
  AuthAttemptDataNotFoundException,
  AuthAttemptTokenMismatchException,
  AuthAttemptTokenUndefinedException,
  NoAuthDataException,
} from '../exception';
import { StateAdapter } from '../state';
import { HttpTransport } from '../transport/http';

import type { AuthStrategyEvent } from './events/auth-strategy.event';
import type { AuthAttemptStateDataBase } from './interfaces';

export abstract class AuthStrategy<
  TStateData extends object,
  TAuthAttemptStateData extends
    AuthAttemptStateDataBase = AuthAttemptStateDataBase,
> extends BreadEventBus<AuthStrategyEvent> {
  readonly http: HttpTransport;

  protected readonly provider: string;
  protected readonly state: StateAdapter;

  protected constructor(state: StateAdapter, provider: string) {
    if (!provider) throw new Error('provider is not specified');

    super();
    this.state = state;
    this.provider = provider;

    this.http = new HttpTransport();
  }

  async readAuthData(breadId: string): Promise<TStateData> {
    const authData = await this.state.read<TStateData>(
      this.createAuthDataStateKey(breadId),
    );

    if (!authData) throw new NoAuthDataException(breadId);

    return authData;
  }

  public async unAuthenticate(breadId: string): Promise<void> {
    await this.clearAuthData(breadId);
    // subclass might decide to do something else on top of this.
  }

  protected async createAuthAttempt(
    breadId: string,
    dataWithoutToken: Omit<TAuthAttemptStateData, 'authAttemptToken'>,
  ) {
    return await this.state.write<TAuthAttemptStateData>(
      this.createAuthAttemptStateKey(breadId),
      await this.createAuthAttemptStateData(breadId, dataWithoutToken),
    );
  }

  protected async createAuthAttemptStateData(
    breadId: string,
    dataWithoutToken: Omit<TAuthAttemptStateData, 'authAttemptToken'>,
  ): Promise<TAuthAttemptStateData> {
    const authAttemptToken = randomBytes(16).toString('base64url');

    // NOTE: Typescript is sometimes wierd about the generic types,
    //   therefore the type cast is needed here.
    //   Given that SomeGeneric extends { someKey: string },
    //   Omit<SomeGeneric, 'someKey'> & { someKey: SomeGeneric['someKey'] }
    //   somehow is not guaranteed to be "assignable" to SomeGeneric.
    //   If somebody can explain why that is in a normal human language,
    //   that would be great!!!
    return { ...dataWithoutToken, authAttemptToken } as TAuthAttemptStateData;
  }

  protected async verifyAuthAttempt(
    breadId: string,
    authAttemptToken?: string,
  ): Promise<TAuthAttemptStateData> {
    if (!authAttemptToken) {
      throw new AuthAttemptTokenUndefinedException(breadId);
    }

    const attemptData = await this.readAuthAttempt(breadId);

    if (attemptData.authAttemptToken !== authAttemptToken) {
      throw new AuthAttemptTokenMismatchException(breadId);
    }

    return attemptData;
  }

  protected async readAuthAttempt(
    breadId: string,
  ): Promise<TAuthAttemptStateData> {
    const attemptData = await this.state.read<TAuthAttemptStateData>(
      this.createAuthAttemptStateKey(breadId),
    );

    if (!attemptData) throw new AuthAttemptDataNotFoundException(breadId);

    return attemptData;
  }

  protected async clearAuthAttempt(breadId: string) {
    await this.state.remove(this.createAuthAttemptStateKey(breadId));
  }

  protected createAuthDataStateKey(breadId: string): string {
    return `${this.provider}:auth-data:${this.constructor.name}:${breadId}`;
  }

  protected createAuthAttemptStateKey(breadId: string): string {
    return `${this.provider}:auth-attempt:${this.constructor.name}:${breadId}`;
  }

  protected async writeAuthData(
    breadId: string,
    data: TStateData,
  ): Promise<void> {
    await this.state.write<TStateData>(
      this.createAuthDataStateKey(breadId),
      data,
    );
  }

  protected async clearAuthData(breadId: string): Promise<void> {
    await this.state
      .remove(this.createAuthDataStateKey(breadId))
      .catch(_ => undefined);
  }

  protected setHeaders(
    requestConfig: AxiosRequestConfig,
    headers: Partial<AxiosRequestConfig['headers']>,
  ): AxiosRequestConfig {
    return {
      ...requestConfig,
      headers: this.mergeHeaders(requestConfig.headers, headers),
    };
  }

  protected addAuthorizationHeader(
    requestConfig: AxiosRequestConfig,
    authorization: string,
  ): AxiosRequestConfig {
    return this.setHeaders(requestConfig, { authorization });
  }

  protected mergeHeaders(
    originalHeaders: object | undefined,
    newHeaders: object | undefined,
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
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig>;

  // TODO: authorization for graphql
}
