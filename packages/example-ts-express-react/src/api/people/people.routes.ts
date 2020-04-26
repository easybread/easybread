import { BambooEmployeesDirectory } from '@easybread/adapter-bamboo-hr';
import {
  GoogleOperationName,
  GooglePeopleCreateOperation,
  GooglePeopleSearchOperation,
  GooglePeopleUpdateOperation
} from '@easybread/adapter-google';
import {
  BreadOperationName,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  EmployeeUpdateOperation
} from '@easybread/operations';
import { Router } from 'express';

import { bambooHrClient, googleClient } from '../shared';
import {
  PeopleCreateRequest,
  PeopleRequest,
  PeopleUpdateRequest
} from './requests';

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
          breadId: '1'
        })
      );

      break;

    default:
      throw new Error('not implemented');
  }
});

peopleRoutes.post('/:adapter', async (req: PeopleCreateRequest, res) => {
  const { adapter } = req.params;

  switch (adapter) {
    case 'google':
      res.json(
        await googleClient.invoke<GooglePeopleCreateOperation>({
          name: GoogleOperationName.PEOPLE_CREATE,
          breadId: '1',
          payload: req.body
        })
      );

      break;

    case 'bamboo':
      res.json(
        await bambooHrClient.invoke<EmployeeCreateOperation>({
          name: BreadOperationName.EMPLOYEE_CREATE,
          breadId: '1',
          payload: req.body
        })
      );

      break;

    default:
      throw new Error('not implemented');
  }
});

peopleRoutes.put('/:adapter/:id', async (req: PeopleUpdateRequest, res) => {
  const { adapter } = req.params;

  switch (adapter) {
    case 'google':
      res.json(
        await googleClient.invoke<GooglePeopleUpdateOperation>({
          name: GoogleOperationName.PEOPLE_UPDATE,
          breadId: '1',
          payload: req.body
        })
      );

      break;

    case 'bamboo':
      res.json(
        await bambooHrClient.invoke<EmployeeUpdateOperation>({
          name: BreadOperationName.EMPLOYEE_UPDATE,
          breadId: '1',
          payload: req.body
        })
      );

      break;

    default:
      throw new Error('not implemented');
  }
});

export { peopleRoutes };
