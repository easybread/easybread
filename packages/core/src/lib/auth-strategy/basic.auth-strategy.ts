import { AxiosRequestConfig } from 'axios';

import { AuthStrategy } from './auth-strategy';
import {
  type AuthAttemptStateDataBase,
  BasicAuthStateData,
} from './interfaces';

interface CreateTokenParams {
  id: string;
  secret: string;
}

export abstract class BasicAuthStrategy<
  TStateData extends BasicAuthStateData,
  TAuthAttemptStateData extends
    AuthAttemptStateDataBase = AuthAttemptStateDataBase,
> extends AuthStrategy<TStateData, TAuthAttemptStateData> {
  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig,
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
