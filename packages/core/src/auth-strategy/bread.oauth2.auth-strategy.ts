import { PausableExecution } from '@easybread/common';
import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from './bread.auth-strategy';
import { BreadOauth2StateData } from './interfaces';

export abstract class BreadOAuth2AuthStrategy<
  TStateData extends BreadOauth2StateData
> extends BreadAuthStrategy<TStateData> {
  private authorizeHttpPausableExecution = new PausableExecution();

  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const authData = await this.readAuthData(breadId);

    if (
      this.isExpired(authData) &&
      !this.authorizeHttpPausableExecution.isPaused
    ) {
      this.authorizeHttpPausableExecution.pause();
      await this.refreshToken(breadId);

      this.authorizeHttpPausableExecution.resume();
      // retry
      return this.authorizeHttp(breadId, requestConfig);
    }

    return this.authorizeHttpPausableExecution.add(async () => {
      // TODO: optimize. We don't need to read it twice when the token is not expired.
      const { accessToken } = await this.readAuthData(breadId);
      return this.addAuthorizationHeader(
        requestConfig,
        `Bearer ${accessToken}`
      );
    });
  }

  protected isExpired(authData: BreadOauth2StateData): boolean {
    const { expiresAt } = authData;
    // if now + 1minute is later than expire date, the token has expired
    return new Date(Date.now() + 1000 * 60) > new Date(expiresAt);
  }

  protected createExpirationDate(expireTimeInMS: number): string {
    // it's "now" in ms + expires_in in ms - 1min in ms
    return new Date(Date.now() + expireTimeInMS - 60 * 1000).toISOString();
  }

  abstract async createAuthUri(
    breadId: string,
    params: object
  ): Promise<string>;

  abstract async refreshToken(breadId: string): Promise<void>;
}
