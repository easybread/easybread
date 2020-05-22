import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload
} from '@easybread/core';

import { GoogleContactsContactMapper } from '../data-mappers';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { GoogleContactsPeopleCreateOperation } from '../operations';

export const GoogleContactsPeopleCreateHandler: BreadOperationHandler<
  GoogleContactsPeopleCreateOperation,
  GoogleContactsAuthStrategy
> = {
  name: GoogleContactsOperationName.PEOPLE_CREATE,
  async handle(input, context) {
    const dataMapper = new GoogleContactsContactMapper();

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

    return createSuccessfulOutputWithRawDataAndPayload(
      GoogleContactsOperationName.PEOPLE_CREATE,
      result.data,
      dataMapper.toSchema(result.data.entry)
    );
  }
};
