import { BambooEmployeesDirectory } from '@easybread/adapter-bamboo-hr';
import {
  GoogleOperationName,
  GooglePeopleSearchOperation
} from '@easybread/adapter-google';
import {
  BreadOperationName,
  EmployeeSearchOperation
} from '@easybread/operations';
import { Router } from 'express';

import { bambooHrClient, googleClient } from '../shared';
import { PeopleRequest } from './PeopleRequest';

const peopleRoutes = Router();

peopleRoutes.get('/:adapter', async (req: PeopleRequest, res) => {
  const { adapter } = req.params;

  switch (adapter) {
    case 'google':
      res.json(
        await googleClient.invoke<GooglePeopleSearchOperation>({
          name: GoogleOperationName.PEOPLE_SEARCH,
          breadId: '1'
        })
      );

      break;

    case 'bamboo':
      res.json(
        await bambooHrClient.invoke<
          EmployeeSearchOperation<BambooEmployeesDirectory>
        >({
          name: BreadOperationName.EMPLOYEE_SEARCH,
          breadId: '1',
          params: { '@type': 'Person' }
        })
      );

      break;

    default:
      throw new Error('not implemented');
  }
});

export { peopleRoutes };
