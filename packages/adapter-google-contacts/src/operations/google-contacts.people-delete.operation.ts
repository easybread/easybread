import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleContactsOperationName } from '../google-contacts.operation-name';

export interface GoogleContactsPeopleDeleteOperation
  extends BreadOperation<GoogleContactsOperationName.PEOPLE_DELETE> {
  input: BreadOperationInputWithPayload<
    GoogleContactsOperationName.PEOPLE_DELETE,
    PersonSchema
  >;
  output: BreadOperationOutputWithPayload<
    GoogleContactsOperationName.PEOPLE_DELETE,
    PersonSchema
  >;
}
