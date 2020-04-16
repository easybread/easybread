import './environment';

import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

import { apiRouter } from './api/api.router';

const CRA_DEV_SERVER_MODE = process.env.CRA_DEV_SERVER_MODE === 'true';
const PORT = CRA_DEV_SERVER_MODE ? 3000 : 8080;

const app: express.Application = express();

app.use(bodyParser.json());

app.use('/', express.static(path.resolve(__dirname, '..', 'build')));
app.use('/api', apiRouter);

app.get('/*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on port ${PORT}!`);
});
