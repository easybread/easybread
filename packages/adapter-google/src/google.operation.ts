import {
  GoogleOauth2CompleteOperation,
  GoogleOauth2StartOperation,
  GooglePeopleCreateOperation,
  GooglePeopleDeleteOperation,
  GooglePeopleSearchOperation,
  GooglePeopleUpdateOperation
} from './operations';

export type GoogleOperation =
  | GoogleOauth2StartOperation
  | GoogleOauth2CompleteOperation
  | GooglePeopleSearchOperation
  | GooglePeopleCreateOperation
  | GooglePeopleUpdateOperation
  | GooglePeopleDeleteOperation;
