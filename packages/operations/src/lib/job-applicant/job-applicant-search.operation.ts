import type {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload,
  BreadOperationPaginationType,
} from '@easybread/core';
import { BreadOperationName } from '../bread.operation-name';
import type { JobApplicantSearchOperationInputParams } from './job-applicant-search.operation.input-params';
import type { PersonSchema } from '@easybread/schemas';

export interface JobApplicantSearchOperation<
  TRawData extends object = object,
  TPaginationType extends BreadOperationPaginationType = 'DISABLED',
  TError = any
> extends BreadCollectionOperation<
    BreadOperationName.JOB_APPLICANT_SEARCH,
    TPaginationType,
    TError
  > {
  name: BreadOperationName.JOB_APPLICANT_SEARCH;

  input: BreadCollectionOperationInputWithParams<
    BreadOperationName.JOB_APPLICANT_SEARCH,
    JobApplicantSearchOperationInputParams,
    TPaginationType
  >;

  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    BreadOperationName.JOB_APPLICANT_SEARCH,
    TRawData,
    PersonSchema[],
    TPaginationType
  >;
}
