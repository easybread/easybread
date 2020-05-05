import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntry } from '../interfaces';

export interface GooglePeopleByIdOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_BY_ID> {
  input: BreadOperationInputWithParams<
    GoogleOperationName.PEOPLE_BY_ID,
    { identifier: string }
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_BY_ID,
    GoogleContactsFeedEntry,
    PersonSchema
  >;
}
