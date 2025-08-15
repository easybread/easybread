import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import type { WorkflowErrorAny } from './Error';

export const EXIT_STATUS = enumSuiteObject(
  enumObject(['SUCCESS', 'ERROR', 'DEFECT']),
);

export type Exit =
  | {
      status: typeof EXIT_STATUS.enum.SUCCESS;
    }
  | {
      status: typeof EXIT_STATUS.enum.ERROR;
      error: WorkflowErrorAny;
    }
  | {
      status: typeof EXIT_STATUS.enum.DEFECT;
      defect?: any;
    };
