import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export interface GoogleContactsPeopleCreateOperation
  extends BreadStandardOperation<GoogleContactsOperationName.PEOPLE_CREATE> {
  input: BreadOperationInputWithPayload<
    GoogleContactsOperationName.PEOPLE_CREATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleContactsOperationName.PEOPLE_CREATE,
    GoogleContactsFeedEntryResponse,
    PersonSchema
  >;
}
