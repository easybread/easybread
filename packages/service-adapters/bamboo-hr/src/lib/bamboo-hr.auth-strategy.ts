import {
  BasicAuthStrategy,
  BreadException,
  StateAdapter,
} from '@easybread/core';

import { BAMBOO_HR_PROVIDER_NAME } from './bamboo-hr.constants';
import {
  BambooAuthStateData,
  BambooBasicAuthPayload,
  type BambooOidcConnectionAttemptStateData,
  type BambooOidcLoginPayload,
  type BambooOidcTokenPayload,
} from './interfaces';

export type BambooHrAuthStrategyOidcOptions = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  applicationKey: string;
};
interface BambooHrAuthStrategyOptions {
  oidcOptions?: BambooHrAuthStrategyOidcOptions;
}

interface AuthenticateOidcParams {
  code: string;
  state: string;
}

export class BambooHrAuthStrategy extends BasicAuthStrategy<
  BambooAuthStateData,
  BambooOidcConnectionAttemptStateData
> {
  private options: BambooHrAuthStrategyOptions;

  constructor(state: StateAdapter, options: BambooHrAuthStrategyOptions = {}) {
    super(state, BAMBOO_HR_PROVIDER_NAME);

    this.options = options;
  }

  configureOidc(oidcOptions: BambooHrAuthStrategyOidcOptions) {
    this.options.oidcOptions = oidcOptions;
  }

  async authenticate(
    breadId: string,
    payload: BambooBasicAuthPayload,
  ): Promise<void> {
    const { apiKey, companyName } = payload;

    // TODO: validate the api key before saving
    const token = this.createBasicToken({ id: apiKey, secret: 'x' });

    await this.writeAuthData(breadId, {
      token,
      companyName,
    });
  }

  async createOidcAuthUri(
    breadId: string,
    payload: { companyName: string },
  ): Promise<string> {
    if (!this.options.oidcOptions) {
      throw new BreadException(
        'BambooHrAuthStrategy is not configured to support OpenID Connect',
      );
    }

    const { clientId, redirectUri } = this.options.oidcOptions;
    const { companyName } = payload;

    const { authAttemptToken } = await this.createAuthAttempt(breadId, {
      breadId,
      companyName,
    });

    const scope = 'openid+email';
    const responseType = 'code';
    const request = 'authorize';

    // The "proper" way to construct this via the URL class
    // url-encodes parameters and BambooHR API throws 400 error.
    return (
      `https://${companyName}.bamboohr.com/authorize.php` +
      `?request=${request}` +
      `&response_type=${responseType}` +
      `&scope=${scope}` +
      `&state=${authAttemptToken}` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}`
    );
  }

  async authenticateOidc(
    breadId: string,
    { code, state }: AuthenticateOidcParams,
  ) {
    if (!this.options.oidcOptions) {
      throw new BreadException(
        'BambooHrAuthStrategy is not configured to support OpenID Connect',
      );
    }

    const { clientId, redirectUri, clientSecret, applicationKey } =
      this.options.oidcOptions;

    const { companyName } = await this.verifyAuthAttempt(breadId, state);

    const createTokenURL = `https://${companyName}.bamboohr.com/token.php?request=token`;
    const createTokenFD = new FormData();
    createTokenFD.append('grant_type', 'authorization_code');
    createTokenFD.append('scope', 'openid email');
    createTokenFD.append('code', code);
    createTokenFD.append('client_id', clientId);
    createTokenFD.append('client_secret', clientSecret);
    createTokenFD.append('redirect_uri', redirectUri);

    const tokenResult = await this.http.request<BambooOidcTokenPayload>({
      method: 'POST',
      url: createTokenURL,
      data: createTokenFD,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!tokenResult?.data?.id_token) {
      throw new BreadException(
        'BambooHrAuthStrategy: id_token is missing from the token response',
      );
    }

    const getApiKeyURL = `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/oidcLogin`;
    const getApiKeyFormData = new FormData();
    getApiKeyFormData.append('id_token', tokenResult.data.id_token);
    getApiKeyFormData.append('applicationKey', applicationKey);

    const getApiKeyResult = await this.http.request<BambooOidcLoginPayload>({
      method: 'POST',
      url: getApiKeyURL,
      data: getApiKeyFormData,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!getApiKeyResult?.data?.success) {
      throw new BreadException(
        'BambooHrAuthStrategy: Failed to get api key with OIDC',
      );
    }

    const token = this.createBasicToken({
      id: getApiKeyResult.data.key,
      secret: 'x',
    });

    await Promise.all([
      this.writeAuthData(breadId, { token, companyName }),
      this.clearAuthAttempt(breadId),
    ]);

    return { companyName };
  }
}
