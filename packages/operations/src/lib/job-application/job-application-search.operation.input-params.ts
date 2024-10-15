import type { ApplyActionSchema } from '@easybread/schemas';

export type JobApplicationSearchOperationInputParams = {
  query?: string;
  actionStatus?: ApplyActionSchema['actionStatus'];
  startTime?: string;
};
