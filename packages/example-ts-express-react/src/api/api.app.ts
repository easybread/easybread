import bodyParser from 'body-parser';
import express from 'express';

import { apiRouter } from './api.router';
import { authMiddleware } from './shared';

const api: express.Application = express();

api.use(bodyParser.json());

api.use('/', authMiddleware);
api.use('/', apiRouter);

export { api };
