import { BreadOAuth2AuthStrategy, BreadStateAdapter } from '@easybread/core';

import {
  GoogleCommonAccessTokenCreateRequestData,
  GoogleCommonAccessTokenCreateResponse,
  GoogleCommonAccessTokenRefreshRequestData,
  GoogleCommonAccessTokenRefreshResponse,
  GoogleCommonAuthorizationParameters,
  GoogleCommonAuthStrategyOptions,
  GoogleCommonOauth2StateData,
} from './interfaces';
import {
  GoogleCommonOauth2CompleteOperationInputPayload,
  GoogleCommonOauth2StartOperationInputPayload,
} from './operations';
import * as queryString from 'node:querystring';

export class GoogleCommonOauth2AuthStrategy<
  TScopes extends string = string
> extends BreadOAuth2AuthStrategy<GoogleCommonOauth2StateData> {
  private readonly options: GoogleCommonAuthStrategyOptions;

  constructor(
    state: BreadStateAdapter,
    providerName: string,
    options: GoogleCommonAuthStrategyOptions
  ) {
    super(state, providerName);
    this.options = options;
  }

  async createAuthUri(
    _breadId: string,
    payload: GoogleCommonOauth2StartOperationInputPayload<TScopes>
  ): Promise<string> {
    const {
      prompt,
      includeGrantedScopes = true,
      loginHint,
      scope = [],
      state,
    } = payload;

    const { clientId, redirectUri } = this.options;

    const params: GoogleCommonAuthorizationParameters = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope.join(' '),
      access_type: 'offline',
      include_granted_scopes: includeGrantedScopes,
      // This is to make google return json instead of atom+xml
      alt: 'json',
    };

    if (loginHint) params.login_hint = loginHint;

    if (state) params.state = state;

    if (prompt) params.prompt = prompt;

    const query = queryString.stringify(params);

    return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
  }

  async authenticate(
    breadId: string,
    payload: GoogleCommonOauth2CompleteOperationInputPayload
  ): Promise<GoogleCommonAccessTokenCreateResponse> {
    const { code } = payload;
    const { clientId, clientSecret, redirectUri } = this.options;

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
        data: queryString.encode(data),
      });

    // save token
    const { access_token, expires_in, refresh_token } = result.data;

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
        data: queryString.encode(data),
      });

    const { expires_in, access_token } = result.data;

    // TODO: handle failed refresh

    await this.writeAuthData(breadId, {
      accessToken: access_token,
      expiresAt: this.createExpirationDate(expires_in * 1000),
      refreshToken,
    });
  }
}
