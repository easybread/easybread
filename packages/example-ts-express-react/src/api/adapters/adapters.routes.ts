import { BambooBasicAuthPayload } from '@easybread/adapter-bamboo-hr';
import {
  BreadOperationName,
  SetupBasicAuthOperation
} from '@easybread/operations';
import { Router } from 'express';

import { bambooHrClient } from '../shared';
import { AdaptersService } from './adapters.service';
import { CreateConfigurationRequest } from './CreateConfigurationRequest';

const adaptersRoutes = Router();

adaptersRoutes.get('/', async (_, res) => {
  res.json(await AdaptersService.adaptersState());
});

adaptersRoutes.post(
  '/:adapter/configurations',
  async ({ params, body }: CreateConfigurationRequest, res) => {
    if (params.adapter === 'bamboo') {
      const { apiKey, companyName } = body;
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

    res.status(404);
    res.send('Not found');
  }
);

export { adaptersRoutes };
