import { BreadOperationHandler } from '@easybread/core';

import { GoogleContactMapper } from '../data-mappers';
import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { GooglePeopleCreateOperation } from '../operations';

export const GooglePeopleCreateHandler: BreadOperationHandler<
  GooglePeopleCreateOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_CREATE,
  async handle(input, context) {
    const dataMapper = new GoogleContactMapper();

    const result = await context.httpRequest<GoogleContactsFeedEntryResponse>({
      method: 'POST',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      },
      data: dataMapper.toRemote(input.payload)
    });

    return {
      name: GoogleOperationName.PEOPLE_CREATE,
      payload: dataMapper.toSchema(result.data.entry),
      rawPayload: { success: true, data: result.data }
    };
  }
};
