import { Router } from 'express';

import { adaptersRoutes } from './adapters';

const apiRouter = Router();

apiRouter.use('/adapters', adaptersRoutes);

export { apiRouter };
