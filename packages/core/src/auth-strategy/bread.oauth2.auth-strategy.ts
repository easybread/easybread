import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from './bread.auth-strategy';
import { BreadOauth2StateData } from './interfaces';

export abstract class BreadOAuth2AuthStrategy<
  TStateData extends BreadOauth2StateData
> extends BreadAuthStrategy<TStateData> {
  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const authData = await this.readAuthData(breadId);

    if (this.isExpired(authData)) {
      // refresh
      await this.refreshToken(breadId);
      // retry
      return this.authorizeHttp(breadId, requestConfig);
    }

    return this.addAuthorizationHeader(
      requestConfig,
      `Bearer ${authData.accessToken}`
    );
  }

  protected isExpired(authData: BreadOauth2StateData): boolean {
    const { expiresAt } = authData;
    // if now + 1minute is later than expire date, the token has expired
    return new Date(Date.now() + 1000 * 60) > new Date(expiresAt);
  }

  protected createExpirationDate(expireTimeInMS: number): string {
    // it's now in ms + expires_in in ms - 1min in ms
    return new Date(Date.now() + expireTimeInMS - 60 * 1000).toISOString();
  }

  abstract async createAuthUri(params: object): Promise<string>;

  abstract async refreshToken(breadId: string): Promise<void>;
}
