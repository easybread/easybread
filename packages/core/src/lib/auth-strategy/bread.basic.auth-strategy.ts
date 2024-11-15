import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from './bread.auth-strategy';
import {
  type BreadAuthAttemptStateDataBase,
  BreadBasicAuthStateData,
} from './interfaces';

interface CreateTokenParams {
  id: string;
  secret: string;
}

export abstract class BreadBasicAuthStrategy<
  TStateData extends BreadBasicAuthStateData,
  TAuthAttemptStateData extends BreadAuthAttemptStateDataBase = BreadAuthAttemptStateDataBase
> extends BreadAuthStrategy<TStateData, TAuthAttemptStateData> {
  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const { token } = await this.readAuthData(breadId);

    const authHeaders = { authorization: `Basic ${token}` };

    return {
      ...requestConfig,
      headers: this.mergeHeaders(requestConfig.headers, authHeaders),
    };
  }

  protected createBasicToken({ id, secret }: CreateTokenParams): string {
    return this.toBase64(`${id}:${secret}`);
  }
}
