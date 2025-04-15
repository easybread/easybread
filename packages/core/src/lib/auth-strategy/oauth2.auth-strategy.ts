import { AxiosRequestConfig } from 'axios';

import { AuthStrategy } from './auth-strategy';
import { AuthenticationLostEvent } from './events/authentication-lost.event';
import { type AuthAttemptStateDataBase, Oauth2StateData } from './interfaces';

export abstract class Oauth2AuthStrategy<
  TStateData extends Oauth2StateData,
  TAuthAttemptStateData extends
    AuthAttemptStateDataBase = AuthAttemptStateDataBase,
> extends AuthStrategy<TStateData, TAuthAttemptStateData> {
  private refreshPromise: Promise<void> | null = null;

  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> {
    const authData = await this.getActiveAuthData(breadId);

    return this.addAuthorizationHeader(
      requestConfig,
      `Bearer ${authData.accessToken}`,
    );
  }

  protected async getActiveAuthData(breadId: string): Promise<Oauth2StateData> {
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
    error: unknown,
  ) {
    await this.clearAuthData(breadId);
    this.publish(
      new AuthenticationLostEvent({
        provider: this.provider,
        breadId,
        error,
      }),
    );
  }

  protected isExpired(authData: Oauth2StateData): boolean {
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
