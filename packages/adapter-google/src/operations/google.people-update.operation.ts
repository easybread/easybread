import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';

export interface GooglePeopleUpdateOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_UPDATE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.PEOPLE_UPDATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_UPDATE,
    GoogleContactsFeedEntryCreateResponse,
    PersonSchema
  >;
}
