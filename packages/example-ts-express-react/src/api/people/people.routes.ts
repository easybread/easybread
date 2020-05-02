import { Router } from 'express';

import { ADAPTER_NAME } from '../../common';
import { handleNotImplemented, handleOperationOutput } from '../shared';
import { PeopleService } from './people.service';
import {
  PeopleCreateRequest,
  PeopleRequest,
  PeopleUpdateRequest
} from './requests';

const peopleRoutes = Router();

peopleRoutes.get('/:adapter', async (req: PeopleRequest, res) => {
  const {
    params: { adapter }
  } = req;

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.searchGoogle(req['user'].id)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.searchBamboo(req['user'].id)
      );
    default:
      return handleNotImplemented(res);
  }
});

peopleRoutes.post('/:adapter', async (req: PeopleCreateRequest, res) => {
  const {
    params: { adapter },
    body
  } = req;

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.createGoogleContact(req['user'].id, body)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.createBambooEmployee(req['user'].id, body)
      );
    default:
      return handleNotImplemented(res);
  }
});

peopleRoutes.put('/:adapter/:id', async (req: PeopleUpdateRequest, res) => {
  const {
    params: { adapter },
    body
  } = req;

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.updateGoogleContact(req['user'].id, body)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.updateBambooEmployee(req['user'].id, body)
      );
    default:
      return handleNotImplemented(res);
  }
});

peopleRoutes.delete('/:adapter/:id', async (req: PeopleUpdateRequest, res) => {
  const {
    params: { adapter, id }
  } = req;

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.deleteGoogleContact(req['user'].id, id)
      );

    default:
      return handleNotImplemented(res);
  }
});

export { peopleRoutes };
