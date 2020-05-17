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
  PeopleSearchRequest,
  PeopleUpdateRequest
} from './requests';

const peopleRoutes = Router();

peopleRoutes.get('/search', async (req: PeopleSearchRequest, res) => {
  const { query } = req.query;

  const breadId = getBreadIdFromRequest(req);
  const adaptersState = await AdaptersService.adaptersState(breadId);
  const outputsPromises: Promise<PeopleSearchResultsItemDto>[] = [];

  if (adaptersState[ADAPTER_NAME.GOOGLE_CONTACTS]?.configured) {
    outputsPromises.push(PeopleService.searchGoogleContacts(breadId, query));
  }
  if (adaptersState[ADAPTER_NAME.BAMBOO]?.configured) {
    outputsPromises.push(PeopleService.searchBamboo(breadId, query));
  }
  if (adaptersState[ADAPTER_NAME.GSUITE_ADMIN]?.configured) {
    outputsPromises.push(PeopleService.searchGsuiteAdmin(breadId, query));
  }

  const outputs: PeopleSearchResponseDto = await Promise.all(outputsPromises);

  res.json(outputs.filter(item => item.rawPayload.success));
});

peopleRoutes.post('/:adapter', async (req: PeopleCreateRequest, res) => {
  const {
    params: { adapter },
    body
  } = req;

  const breadId = getBreadIdFromRequest(req);

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE_CONTACTS:
      return handleOperationOutput(
        res,
        await PeopleService.createGoogleContact(breadId, body)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.createBambooEmployee(breadId, body)
      );
    case ADAPTER_NAME.GSUITE_ADMIN:
      return handleOperationOutput(
        res,
        await PeopleService.createGsuiteUser(breadId, body)
      );
    default:
      return handleNotImplemented(res);
  }
});

peopleRoutes.get('/:adapter/:id', async (req: PeopleByIdRequest, res) => {
  const { adapter, id } = req.params;
  const breadId = getBreadIdFromRequest(req);

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE_CONTACTS:
      return handleOperationOutput(
        res,
        await PeopleService.byIdGoogleContacts(breadId, id)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.byIdBamboo(breadId, id)
      );
    case ADAPTER_NAME.GSUITE_ADMIN:
      return handleOperationOutput(
        res,
        await PeopleService.byIdGsuite(breadId, id)
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

  const breadId = getBreadIdFromRequest(req);

  switch (adapter) {
    case ADAPTER_NAME.GOOGLE_CONTACTS:
      return handleOperationOutput(
        res,
        await PeopleService.updateGoogleContact(breadId, body)
      );
    case ADAPTER_NAME.BAMBOO:
      return handleOperationOutput(
        res,
        await PeopleService.updateBambooEmployee(breadId, body)
      );
    case ADAPTER_NAME.GSUITE_ADMIN:
      return handleOperationOutput(
        res,
        await PeopleService.updateGsuiteUser(breadId, body)
      );
    default:
      return handleNotImplemented(res);
  }
});

peopleRoutes.delete('/:adapter/:id', async (req: PeopleUpdateRequest, res) => {
  const {
    params: { adapter, id }
  } = req;

  const breadId = getBreadIdFromRequest(req);
  switch (adapter) {
    case ADAPTER_NAME.GOOGLE_CONTACTS:
      return handleOperationOutput(
        res,
        await PeopleService.deleteGoogleContact(breadId, id)
      );

    case ADAPTER_NAME.GSUITE_ADMIN:
      return handleOperationOutput(
        res,
        await PeopleService.deleteGsuiteUser(breadId, id)
      );

    default:
      return handleNotImplemented(res);
  }
});

export { peopleRoutes };
