import { Router } from 'express';

import {
  getBreadIdFromRequest,
  handleNotImplemented,
  handleOperationOutput
} from '../shared';
import { AdaptersService } from './adapters.service';
import {
  CompleteAuthRequest,
  ConfigurationCreateRequest,
  ConfigurationDeleteRequest
} from './requests';
import { isCompleteGoogleOAuthRequest } from './requests/complete-auth.request';
import {
  isSetupBambooRequest,
  isSetupGoogleRequest
} from './requests/configuration-create.request';

const adaptersRoutes = Router();

adaptersRoutes.get('/', async (req, res) => {
  res.json(await AdaptersService.adaptersState(req['user'].id));
});

adaptersRoutes.delete(
  '/:adapter/configurations',
  async (req: ConfigurationDeleteRequest, res) => {
    res.json(
      await AdaptersService.resetConfiguration(
        getBreadIdFromRequest(req),
        req.params.adapter
      )
    );
  }
);

adaptersRoutes.post(
  '/:adapter/configurations',
  async (req: ConfigurationCreateRequest, res) => {
    if (isSetupBambooRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.createBambooConfiguration(
          req['user'].id,
          req.body
        )
      );
    }

    if (isSetupGoogleRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.startGoogleOAuthFlow(req['user'].id)
      );
    }

    handleNotImplemented(res);
  }
);

adaptersRoutes.post(
  '/:adapter/complete-oauth',
  async (req: CompleteAuthRequest, res) => {
    if (isCompleteGoogleOAuthRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.completeGoogleOAuthFlow(req['user'].id, req.body)
      );
    }

    handleNotImplemented(res);
  }
);

export { adaptersRoutes };
