import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from '../../auth-strategy';
import { BreadStateAdapter } from '../../state';
import { BREEZY_PROVIDER } from './breezy.constants';
import {
  BreezyAuthenticatePayload,
  BreezyAuthenticateResponse,
  BreezyAuthStateData
} from './interfaces';

export class BreezyAuthStrategy extends BreadAuthStrategy<BreezyAuthStateData> {
  constructor(state: BreadStateAdapter) {
    super(state, BREEZY_PROVIDER);
  }

  async authenticate(
    breadId: string,
    payload: BreezyAuthenticatePayload
  ): Promise<BreezyAuthenticateResponse> {
    const result = await this.http.request<BreezyAuthenticateResponse>({
      method: 'POST',
      url: 'https://api.breezy.hr/v3/signin',
      data: payload
    });

    await this.writeAuthData(breadId, {
      accessToken: result.data.access_token
    });

    return result.data;
  }

  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const { accessToken } = await this.readAuthData(breadId);
    return this.addAuthorizationHeader(requestConfig, `Bearer ${accessToken}`);
  }
}
