import { breadDataAdapter } from '@easybread/data-adapter';
import type { ApplyActionSchema } from '@easybread/schemas';
import type { BambooApplication } from '../interfaces';
import { bambooEmployeeAdapter } from './bamboo.employee.adapter';
import { NO_MAP } from '@easybread/data-mapper';

export const bambooApplicationAdapter = breadDataAdapter<
  ApplyActionSchema,
  BambooApplication
>({
  // we don't map to external
  toExternal: {
    id: NO_MAP,
    rating: NO_MAP,
    applicant: NO_MAP,
    status: NO_MAP,
    job: NO_MAP,
    appliedDate: NO_MAP,
  },

  toInternal: {
    '@type': () => 'ApplyAction',
    identifier: (_) => _.id.toString(),
    starTime: 'appliedDate',
    result: (_) => {
      if (_.rating === null) return NO_MAP;
      return {
        '@type': 'Rating',
        ratingValue: _.rating,
      };
    },
    agent: (e) => bambooEmployeeAdapter.toInternal(e.applicant),
    object: {
      '@type': () => 'JobPosting',
      identifier: (_) => _.job.id.toString(),
      title: (_) => _.job.title.label,
    },
    // TODO: allow user to provide a status mapping function,
    //   that would allow to map custom status values to actionStatus
    actionStatus: NO_MAP,
  },
});
