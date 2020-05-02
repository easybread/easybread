import { Router } from 'express';

import { handleNotImplemented, handleOperationOutput } from '../shared';
import { AdaptersService } from './adapters.service';
import { CompleteAuthRequest, CreateConfigurationRequest } from './requests';
import { isCompleteGoogleOAuthRequest } from './requests/complete-auth.request';
import {
  isSetupBambooRequest,
  isSetupGoogleRequest
} from './requests/create-configuration.request';

const adaptersRoutes = Router();

adaptersRoutes.get('/', async (_, res) => {
  res.json(await AdaptersService.adaptersState());
});

adaptersRoutes.post(
  '/:adapter/configurations',
  async (req: CreateConfigurationRequest, res) => {
    if (isSetupBambooRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.createBambooConfiguration(req.body)
      );
    }

    if (isSetupGoogleRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.startGoogleOAuthFlow()
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
        await AdaptersService.completeGoogleOAuthFlow(req.body)
      );
    }

    handleNotImplemented(res);
  }
);

export { adaptersRoutes };
