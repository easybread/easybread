import { breadDataAdapter } from '@easybread/data-adapter';
import type { BambooApplicationListQuery } from '../interfaces';
import type { JobApplicantSearchOperationInputParams } from '@easybread/operations';
import { NO_MAP } from '@easybread/data-mapper';

export const bambooApplicationsListQueryAdapter = breadDataAdapter<
  JobApplicantSearchOperationInputParams,
  BambooApplicationListQuery
>({
  toExternal: {
    applicationStatus: (_) => {
      switch (_.actionStatus) {
        case 'ActiveActionStatus':
          return 'ACTIVE';

        case 'FailedActionStatus':
          return 'INACTIVE';

        case 'CompletedActionStatus':
          return 'HIRED';

        case 'PotentialActionStatus':
          return 'NEW';

        default:
          return NO_MAP;
      }
    },
    newSince: (_) => {
      if (!_.startTime) return NO_MAP;
      const date = new Date(_.startTime);
      const utcYear = date.getUTCFullYear();
      const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
      const utcDate = String(date.getUTCDate()).padStart(2, '0');
      const utcHours = String(date.getUTCHours()).padStart(2, '0');
      const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0');
      const utcSeconds = String(date.getUTCSeconds()).padStart(2, '0');

      return `${utcYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds}`;
    },

    searchString: 'query',
  },

  toInternal: {
    actionStatus: (_) => {
      switch (_.applicationStatus) {
        case 'ACTIVE':
          return 'ActiveActionStatus';

        case 'INACTIVE':
          return 'FailedActionStatus';

        case 'HIRED':
          return 'CompletedActionStatus';

        case 'NEW':
          return 'PotentialActionStatus';

        default:
          return NO_MAP;
      }
    },
    startTime: (_) => {
      if (!_.newSince) return NO_MAP;
      return new Date(_.newSince).toISOString();
    },
    query: 'searchString',
  },
});
