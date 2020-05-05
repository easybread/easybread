import { BreadOperationHandler } from '@easybread/core';

import { GoogleContactMapper } from '../data-mappers';
import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { GooglePeopleByIdOperation } from '../operations';

export const GooglePeopleByIdHandler: BreadOperationHandler<
  GooglePeopleByIdOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_BY_ID,
  async handle(input, context) {
    const { identifier } = input.params;

    const result = await context.httpRequest<GoogleContactsFeedEntryResponse>({
      method: 'GET',
      url: `https://www.google.com/m8/feeds/contacts/default/full/${identifier}`,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    const contactMapper = new GoogleContactMapper();

    return {
      name: GoogleOperationName.PEOPLE_BY_ID,
      payload: contactMapper.toSchema(result.data.entry),
      rawPayload: { success: true, data: result.data }
    };
  }
};
