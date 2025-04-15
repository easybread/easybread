import { injectIntoUrlSearchParams, toFormData } from '@easybread/common';
import { Oauth2AuthStrategy, StateAdapter } from '@easybread/core';
import type {
  AuthCompleteOauth2RequestSchema,
  AuthStartOauth2RequestSchema,
} from '@easybread/schemas';

import type { GoogleCommonOauth2ConnectionAttemptStateData } from './interfaces';
import {
  GoogleCommonAccessTokenCreateRequestData,
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonAccessTokenRefreshRequestData,
  GoogleCommonAccessTokenRefreshResponse,
  GoogleCommonAuthStrategyOptions,
  GoogleCommonAuthorizationParameters,
  GoogleCommonOauth2StateData,
} from './interfaces';

export class GoogleCommonOauth2AuthStrategy<
  TScopes extends string = string,
> extends Oauth2AuthStrategy<
  GoogleCommonOauth2StateData,
  GoogleCommonOauth2ConnectionAttemptStateData
> {
  private readonly options: GoogleCommonAuthStrategyOptions;

  constructor(
    state: StateAdapter,
    providerName: string,
    options: GoogleCommonAuthStrategyOptions,
  ) {
    super(state, providerName);
    this.options = options;
  }

  async createAuthUri(
    breadId: string,
    payload: Omit<AuthStartOauth2RequestSchema<TScopes>, '@context' | '@type'>,
  ): Promise<string> {
    const { loginHint, scope = [], prompt = ['consent'] } = payload;
    const { clientId, redirectUri } = this.options;

    const includeGrantedScopes = true;

    const { authAttemptToken } = await this.createAuthAttempt(breadId, {});

    const params: GoogleCommonAuthorizationParameters = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope.join(' '),
      access_type: 'offline',
      include_granted_scopes: includeGrantedScopes,
      // This is to make google return json instead of atom+xml
      alt: 'json',
      state: authAttemptToken,
      prompt,
    };

    if (loginHint) params.login_hint = loginHint;

    const url = new URL('/o/oauth2/v2/auth', 'https://accounts.google.com');

    injectIntoUrlSearchParams(url.searchParams, params);

    return url.href;
  }

  async authenticate(
    breadId: string,
    payload: Omit<AuthCompleteOauth2RequestSchema, '@context' | '@type'>,
  ): Promise<GoogleCommonAccessTokenCreateResponse> {
    const { code, state } = payload;
    const { clientId, clientSecret, redirectUri } = this.options;

    await this.verifyAuthAttempt(breadId, state);

    const data: GoogleCommonAccessTokenCreateRequestData = {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code,
    };

    const result =
      await this.http.request<GoogleCommonAccessTokenCreateResponse>({
        method: 'POST',
        url: 'https://oauth2.googleapis.com/token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: toFormData(data),
      });

    // save token
    const { access_token, expires_in, refresh_token } = result.data;

    await this.clearAuthAttempt(breadId);
    await this.writeAuthData(breadId, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: this.createExpirationDate(expires_in * 1000),
    });

    return result.data;
  }

  async refreshToken(breadId: string): Promise<void> {
    const { refreshToken } = await this.readAuthData(breadId);
    const { clientSecret, clientId } = this.options;

    const data: GoogleCommonAccessTokenRefreshRequestData = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const result =
      await this.http.request<GoogleCommonAccessTokenRefreshResponse>({
        method: 'POST',
        url: 'https://oauth2.googleapis.com/token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: toFormData(data),
      });

    const { expires_in, access_token } = result.data;

    await this.writeAuthData(breadId, {
      accessToken: access_token,
      expiresAt: this.createExpirationDate(expires_in * 1000),
      refreshToken,
    });
  }
}
