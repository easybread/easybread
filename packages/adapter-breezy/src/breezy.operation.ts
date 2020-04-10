import {
  BreezyAuthenticateOperation,
  BreezyCompanySearchOperation
} from './operations';

export type BreezyOperation =
  | BreezyAuthenticateOperation
  | BreezyCompanySearchOperation;
