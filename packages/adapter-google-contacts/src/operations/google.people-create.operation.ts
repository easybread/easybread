import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export interface GooglePeopleCreateOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_CREATE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.PEOPLE_CREATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_CREATE,
    GoogleContactsFeedEntryResponse,
    PersonSchema
  >;
}
