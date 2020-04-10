import {
  GoogleOauth2CompleteOperation,
  GoogleOauth2StartOperation,
  GooglePeopleSearchOperation
} from './operations';

export type GoogleOperation =
  | GoogleOauth2StartOperation
  | GoogleOauth2CompleteOperation
  | GooglePeopleSearchOperation;
