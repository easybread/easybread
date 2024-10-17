import type {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload,
  BreadOperationPaginationType,
} from '@easybread/core';
import type { BreadOperationName } from '../bread.operation-name';
import type { JobApplicationSearchOperationInputParams } from './job-application-search.operation.input-params';
import type { ApplyActionSchema } from '@easybread/schemas';

export interface JobApplicationSearchOperation<
  TRawData extends object = object,
  TPaginationType extends BreadOperationPaginationType = 'DISABLED',
  TError = any
> extends BreadCollectionOperation<
    BreadOperationName.JOB_APPLICATION_SEARCH,
    TPaginationType,
    TError
  > {
  name: BreadOperationName.JOB_APPLICATION_SEARCH;
  input: BreadCollectionOperationInputWithParams<
    BreadOperationName.JOB_APPLICATION_SEARCH,
    JobApplicationSearchOperationInputParams,
    TPaginationType
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    BreadOperationName.JOB_APPLICATION_SEARCH,
    TRawData,
    ApplyActionSchema[],
    TPaginationType
  >;
}
