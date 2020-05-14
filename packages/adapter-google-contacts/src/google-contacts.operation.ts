import { GoogleCommonOauth2CompleteOperation } from '@easybread/google-common';

import {
  GoogleContactsOauth2StartOperation,
  GoogleContactsPeopleByIdOperation,
  GoogleContactsPeopleCreateOperation,
  GoogleContactsPeopleDeleteOperation,
  GoogleContactsPeopleSearchOperation,
  GoogleContactsPeopleUpdateOperation
} from './operations';

export type GoogleContactsOperation =
  | GoogleContactsOauth2StartOperation
  | GoogleCommonOauth2CompleteOperation
  | GoogleContactsPeopleByIdOperation
  | GoogleContactsPeopleSearchOperation
  | GoogleContactsPeopleCreateOperation
  | GoogleContactsPeopleUpdateOperation
  | GoogleContactsPeopleDeleteOperation;
