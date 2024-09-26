import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from './bread.auth-strategy';
import { BreadOauth2StateData } from './interfaces';
import { BreadAuthenticationLostEvent } from './events/bread.authentication-lost.event';

export abstract class BreadOAuth2AuthStrategy<
  TStateData extends BreadOauth2StateData
> extends BreadAuthStrategy<TStateData> {
  private refreshPromise: Promise<void> | null = null;

  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const authData = await this.getActiveAuthData(breadId);

    return this.addAuthorizationHeader(
      requestConfig,
      `Bearer ${authData.accessToken}`
    );
  }

  protected async getActiveAuthData(
    breadId: string
  ): Promise<BreadOauth2StateData> {
    try {
      const authData = await this.readAuthData(breadId);

      if (!this.isExpired(authData)) return authData;

      // Token is expired, check if a refresh is already in progress
      // and if not, start a new refresh process
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshToken(breadId).finally(() => {
          this.refreshPromise = null;
        });
      }

      // Wait for the refresh operation to complete
      await this.refreshPromise;

      // After refresh, read the auth data again
      return await this.readAuthData(breadId);
    } catch (error) {
      await this.handleGetActiveAuthDataFailed(breadId, error);
      throw error;
    }
  }

  protected async handleGetActiveAuthDataFailed(
    breadId: string,
    error: unknown
  ) {
    await this.clearAuthData(breadId);
    this.publish(
      new BreadAuthenticationLostEvent({
        provider: this.provider,
        breadId,
        error,
      })
    );
  }

  protected isExpired(authData: BreadOauth2StateData): boolean {
    const { expiresAt } = authData;
    return new Date(Date.now()) > new Date(expiresAt);
  }

  protected createExpirationDate(expireTimeInMS: number): string {
    // it's "now" in ms + expires_in in ms - 1min in ms
    return new Date(Date.now() + expireTimeInMS - 60 * 1000).toISOString();
  }

  abstract createAuthUri(breadId: string, params: object): Promise<string>;

  abstract refreshToken(breadId: string): Promise<void>;
}
