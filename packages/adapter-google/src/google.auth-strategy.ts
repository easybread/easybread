import { BreadOAuth2AuthStrategy, BreadStateAdapter } from '@easybread/core';
import queryString from 'querystring';

import { GOOGLE_PROVIDER } from './google.constants';
import {
  GoogleAccessTokenCreateRequestData,
  GoogleAccessTokenCreateResponse,
  GoogleAccessTokenRefreshRequestData,
  GoogleAccessTokenRefreshResponse,
  GoogleAuthorizationParameters,
  GoogleOauth2CompleteInputPayload,
  GoogleOauth2StartInputPayload,
  GoogleOauth2StateData
} from './interfaces';

export class GoogleAuthStrategy extends BreadOAuth2AuthStrategy<
  GoogleOauth2StateData
> {
  constructor(state: BreadStateAdapter) {
    super(state, GOOGLE_PROVIDER);
  }

  async createAuthUri(
    breadId: string,
    payload: GoogleOauth2StartInputPayload
  ): Promise<string> {
    const {
      prompt,
      clientId,
      clientSecret,
      includeGrantedScopes = true,
      loginHint,
      redirectUri,
      scope = [],
      state
    } = payload;

    const params: GoogleAuthorizationParameters = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: clientId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      redirect_uri: redirectUri,
      // eslint-disable-next-line @typescript-eslint/camelcase
      response_type: 'code',
      scope: scope.join(' '),
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_type: 'offline',
      // eslint-disable-next-line @typescript-eslint/camelcase
      include_granted_scopes: includeGrantedScopes,
      // This is to make google return json instead of atom+xml
      alt: 'json'
    };

    // eslint-disable-next-line @typescript-eslint/camelcase
    if (loginHint) params.login_hint = loginHint;

    // eslint-disable-next-line @typescript-eslint/camelcase
    if (state) params.state = state;

    // eslint-disable-next-line @typescript-eslint/camelcase
    if (prompt) params.prompt = prompt;

    const query = queryString.stringify(params);

    // save client id and client secret for future calls
    await this.writeAuthData(breadId, {
      clientId,
      clientSecret,
      accessToken: '',
      expiresAt: new Date().toISOString(),
      refreshToken: ''
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
  }

  async authenticate(
    breadId: string,
    payload: GoogleOauth2CompleteInputPayload
  ): Promise<GoogleAccessTokenCreateResponse> {
    const { code, redirectUri } = payload;
    const { clientId, clientSecret } = await this.readAuthData(breadId);

    const data: GoogleAccessTokenCreateRequestData = {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code
    };

    const result = await this.http.request<GoogleAccessTokenCreateResponse>({
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: queryString.encode(data)
    });

    // save token
    const { access_token, expires_in, refresh_token } = result.data;

    await this.writeAuthData(breadId, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: this.createExpirationDate(expires_in * 1000),
      clientId,
      clientSecret
    });

    return result.data;
  }

  async refreshToken(breadId: string): Promise<void> {
    const { clientId, clientSecret, refreshToken } = await this.readAuthData(
      breadId
    );

    const data: GoogleAccessTokenRefreshRequestData = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };

    const result = await this.http.request<GoogleAccessTokenRefreshResponse>({
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: queryString.encode(data)
    });

    const { expires_in, access_token } = result.data;

    // TODO: handle failed refresh

    await this.writeAuthData(breadId, {
      accessToken: access_token,
      expiresAt: this.createExpirationDate(expires_in * 1000),
      refreshToken,
      clientId,
      clientSecret
    });
  }
}
