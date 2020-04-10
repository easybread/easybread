import { BreadBasicAuthStrategy, BreadStateAdapter } from '@easybread/core';

import { BAMBOO_HR_PROVIDER } from './bamboo-hr.constants';
import { BambooAuthStateData, BambooBasicAuthPayload } from './interfaces';

export class BambooHrAuthStrategy extends BreadBasicAuthStrategy<
  BambooAuthStateData
> {
  constructor(state: BreadStateAdapter) {
    super(state, BAMBOO_HR_PROVIDER);
  }

  async authenticate(
    breadId: string,
    payload: BambooBasicAuthPayload
  ): Promise<void> {
    const { apiKey, companyName } = payload;

    // TODO: validate the api key before saving
    const token = this.createBasicToken({ id: apiKey, secret: 'x' });

    await this.writeAuthData(breadId, {
      token,
      companyName
    });
  }
}
