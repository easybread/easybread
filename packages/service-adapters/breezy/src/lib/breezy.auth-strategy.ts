import { AuthStrategy, StateAdapter } from '@easybread/core';
import { AxiosRequestConfig } from 'axios';

import { BREEZY_PROVIDER_NAME } from './breezy.constants';
import {
  BreezyAuthStateData,
  BreezyAuthenticatePayload,
  BreezyAuthenticateResponse,
} from './interfaces';

export class BreezyAuthStrategy extends AuthStrategy<BreezyAuthStateData> {
  constructor(state: StateAdapter) {
    super(state, BREEZY_PROVIDER_NAME);
  }

  async authenticate(
    breadId: string,
    payload: BreezyAuthenticatePayload,
  ): Promise<BreezyAuthenticateResponse> {
    const result = await this.http.request<BreezyAuthenticateResponse>({
      method: 'POST',
      url: 'https://api.breezy.hr/v3/signin',
      data: payload,
    });

    await this.writeAuthData(breadId, {
      accessToken: result.data.access_token,
    });

    return result.data;
  }

  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> {
    const { accessToken } = await this.readAuthData(breadId);
    return this.addAuthorizationHeader(requestConfig, `Bearer ${accessToken}`);
  }
}
