import { Router } from 'express';

import { ADAPTER_NAME } from '../../common';
import { AdaptersService } from '../adapters/adapters.service';
import {
  getBreadIdFromRequest,
  handleNotImplemented,
  handleOperationOutput
} from '../shared';
import { PeopleSearchResponseDto, PeopleSearchResultsItemDto } from './dtos';
import { PeopleService } from './people.service';
import {
  PeopleByIdRequest,
  PeopleCreateRequest,
  PeopleRequest,
  PeopleSearchRequest,
  PeopleUpdateRequest
} from './requests';

const peopleRoutes = Router();

peopleRoutes.get('/search', async (req: PeopleSearchRequest, res) => {
  const { query } = req.query;

  const breadId = getBreadIdFromRequest(req);
  const adaptersState = await AdaptersService.adaptersState(breadId);
  const outputsPromises: Promise<PeopleSearchResultsItemDto>[] = [];

  if (adaptersState.google?.configured) {
    outputsPromises.push(PeopleService.searchGoogle(breadId, query));
  }
  if (adaptersState.bamboo?.configured) {
    outputsPromises.push(PeopleService.searchBamboo(breadId, query));
  }

  const outputs: PeopleSearchResponseDto = await Promise.all(outputsPromises);

  res.json(outputs.filter(item => item.rawPayload.success));
});

peopleRoutes.get('/:adapter', async (req: PeopleRequest, res) => {
  const {
    params: { adapter }
  } = req;

  const breadId = getBreadIdFromRequest(req);

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.searchGoogle(breadId)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.searchBamboo(breadId)
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

  const breadId = getBreadIdFromRequest(req);

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.createGoogleContact(breadId, body)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.createBambooEmployee(breadId, body)
      );
    default:
      return handleNotImplemented(res);
  }
});

peopleRoutes.get('/:adapter/:id', async (req: PeopleByIdRequest, res) => {
  const { adapter, id } = req.params;
  const breadId = getBreadIdFromRequest(req);

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE:
      return handleOperationOutput(
        res,
        await PeopleService.byIdGoogle(breadId, id)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.byIdBamboo(breadId, id)
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
