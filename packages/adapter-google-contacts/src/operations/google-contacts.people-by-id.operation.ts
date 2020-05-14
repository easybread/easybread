import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export interface GoogleContactsPeopleByIdOperation
  extends BreadOperation<GoogleContactsOperationName.PEOPLE_BY_ID> {
  input: BreadOperationInputWithParams<
    GoogleContactsOperationName.PEOPLE_BY_ID,
    { identifier: string }
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleContactsOperationName.PEOPLE_BY_ID,
    GoogleContactsFeedEntryResponse,
    PersonSchema
  >;
}
