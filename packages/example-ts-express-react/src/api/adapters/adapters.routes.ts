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
  ConfigurationDeleteRequest,
  isCompleteGoogleOAuthRequest,
  isCompleteGSuiteAdminOAuthRequest,
  isSetupBambooRequest,
  isSetupGoogleRequest,
  isSetupGsuiteAdminRequest
} from './requests';

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
    const breadId = getBreadIdFromRequest(req);

    if (isSetupBambooRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.createBambooConfiguration(breadId, req.body)
      );
    }

    if (isSetupGoogleRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.startGoogleOAuthFlow(breadId)
      );
    }

    if (isSetupGsuiteAdminRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.startGSuiteAdminOAuthFlow(breadId)
      );
    }

    handleNotImplemented(res);
  }
);

adaptersRoutes.post(
  '/:adapter/complete-oauth',
  async (req: CompleteAuthRequest, res) => {
    const breadId = getBreadIdFromRequest(req);

    if (isCompleteGoogleOAuthRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.completeGoogleOAuthFlow(breadId, req.body)
      );
    }

    if (isCompleteGSuiteAdminOAuthRequest(req)) {
      return handleOperationOutput(
        res,
        await AdaptersService.completeGsuiteAdminOAuthFlow(breadId, req.body)
      );
    }

    handleNotImplemented(res);
  }
);

export { adaptersRoutes };
