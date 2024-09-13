import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2StartOperation,
} from '@easybread/adapter-google-common';

import {
  GoogleContactsPeopleByIdOperation,
  GoogleContactsPeopleCreateOperation,
  GoogleContactsPeopleDeleteOperation,
  GoogleContactsPeopleSearchOperation,
  GoogleContactsPeopleUpdateOperation,
} from './operations';

export type GoogleContactsOperation =
  | GoogleCommonOauth2StartOperation
  | GoogleCommonOauth2CompleteOperation
  | GoogleContactsPeopleByIdOperation
  | GoogleContactsPeopleSearchOperation
  | GoogleContactsPeopleCreateOperation
  | GoogleContactsPeopleUpdateOperation
  | GoogleContactsPeopleDeleteOperation;
