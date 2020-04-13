import { Router } from 'express';

import { adaptersRoutes } from './adapters';
import { peopleRoutes } from './people';

const apiRouter = Router();

apiRouter.use('/adapters', adaptersRoutes);
apiRouter.use('/people', peopleRoutes);

export { apiRouter };
