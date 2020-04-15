import './environment';

import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

import { apiRouter } from './api/api.router';

const app: express.Application = express();

app.use(bodyParser.json());

app.use('/', express.static(path.resolve(__dirname, '..', 'build')));
app.use('/api', apiRouter);

app.get('/*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App is listening on port 3000!');
});
