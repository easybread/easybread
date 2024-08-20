import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export interface GoogleContactsPeopleUpdateOperation
  extends BreadStandardOperation<GoogleContactsOperationName.PEOPLE_UPDATE> {
  input: BreadOperationInputWithPayload<
    GoogleContactsOperationName.PEOPLE_UPDATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleContactsOperationName.PEOPLE_UPDATE,
    GoogleContactsFeedEntryResponse,
    PersonSchema
  >;
}
