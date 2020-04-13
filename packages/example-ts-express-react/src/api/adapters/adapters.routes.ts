import { BambooBasicAuthPayload } from '@easybread/adapter-bamboo-hr';
import {
  GoogleOauth2CompleteOperation,
  GoogleOauth2StartOperation,
  GoogleOperationName
} from '@easybread/adapter-google';
import {
  BreadOperationName,
  SetupBasicAuthOperation
} from '@easybread/operations';
import { Router } from 'express';

import { SetupBambooDto, SetupGoogleDto } from '../../dtos';
import { bambooHrClient, googleClient } from '../shared';
import { AdaptersService } from './adapters.service';
import { CompleteAuthRequest } from './CompleteAuthRequest';
import { CreateConfigurationRequest } from './CreateConfigurationRequest';

const adaptersRoutes = Router();

adaptersRoutes.get('/', async (_, res) => {
  res.json(await AdaptersService.adaptersState());
});

adaptersRoutes.post(
  '/:adapter/configurations',
  async (req: CreateConfigurationRequest, res) => {
    if (req.params.adapter === 'bamboo') {
      const { apiKey, companyName } = req.body as SetupBambooDto;
      const result = await bambooHrClient.invoke<
        SetupBasicAuthOperation<BambooBasicAuthPayload>
      >({
        name: BreadOperationName.SETUP_BASIC_AUTH,
        breadId: '1',
        payload: { apiKey, companyName }
      });

      await AdaptersService.setConfigured('bamboo');

      res.json(result);

      return;
    }

    if (req.params.adapter === 'google') {
      const { clientId, clientSecret } = req.body as SetupGoogleDto;
      const result = await googleClient.invoke<GoogleOauth2StartOperation>({
        name: GoogleOperationName.AUTH_FLOW_START,
        breadId: '1',
        payload: {
          clientId,
          clientSecret,
          prompt: ['consent'],
          includeGrantedScopes: true,
          redirectUri: 'http://localhost:8080/complete-google-auth',
          scope: [
            'https://www.google.com/m8/feeds/',
            'https://www.googleapis.com/auth/contacts.readonly'
          ]
        }
      });

      if (!result.rawPayload.success) {
        res.status(500);
        res.json(result);
        return;
      }

      res.json(result);
      return;
    }

    res.status(404);
    res.send('Not found');
  }
);

adaptersRoutes.post(
  '/:adapter/complete-oauth',

  async (req: CompleteAuthRequest, res) => {
    const { code } = req.body;
    const result = await googleClient.invoke<GoogleOauth2CompleteOperation>({
      name: GoogleOperationName.AUTH_FLOW_COMPLETE,
      breadId: '1',
      payload: {
        code,
        redirectUri: 'http://localhost:8080/complete-google-auth'
      }
    });

    if (!result.rawPayload.success) {
      res.status(500);
      res.json(result);
      return;
    }

    await AdaptersService.setConfigured('google');

    res.json(result);
  }
);

export { adaptersRoutes };
