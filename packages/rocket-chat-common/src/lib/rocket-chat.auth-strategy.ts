import { BreadAuthStrategy, BreadStateAdapter } from '@easybread/core';
import { AxiosRequestConfig } from 'axios';

import { RocketChatAuthStateData } from './interfaces';

export class RocketChatAuthStrategy extends BreadAuthStrategy<
  RocketChatAuthStateData
> {
  constructor(state: BreadStateAdapter, provider: string = 'ROCKET_CHAT') {
    super(state, provider);
  }

  async authenticate(
    breadId: string,
    payload: { authToken: string; userId: string }
  ): Promise<void> {
    await this.writeAuthData(breadId, payload);
  }

  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const { authToken, userId } = await this.readAuthData(breadId);
    return this.setHeaders(requestConfig, {
      'X-Auth-Token': authToken,
      'X-User-Id': userId
    });
  }
}
