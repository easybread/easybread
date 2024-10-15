import type { ApplyActionSchema } from '@easybread/schemas';

export type JobApplicantSearchOperationInputParams = {
  query?: string;
  actionStatus?: ApplyActionSchema['actionStatus'];
  startTime?: string;
};
