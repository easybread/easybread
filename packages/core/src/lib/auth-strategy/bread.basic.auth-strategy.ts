import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from './bread.auth-strategy';
import { BreadBasicAuthStateData } from './interfaces';

interface CreateTokenParams {
  id: string;
  secret: string;
}

export abstract class BreadBasicAuthStrategy<
  TStateData extends BreadBasicAuthStateData
> extends BreadAuthStrategy<TStateData> {
  async authorizeHttp(
    breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const { token } = await this.readAuthData(breadId);

    const authHeaders = { authorization: `Basic ${token}` };

    return {
      ...requestConfig,
      headers: this.mergeHeaders(requestConfig.headers, authHeaders)
    };
  }

  protected createBasicToken({ id, secret }: CreateTokenParams): string {
    return this.toBase64(`${id}:${secret}`);
  }
}
