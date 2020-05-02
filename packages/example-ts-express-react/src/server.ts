import './environment';

import express from 'express';
import path from 'path';

import { api } from './api/api.app';

const CRA_DEV_SERVER_MODE = process.env.CRA_DEV_SERVER_MODE === 'true';
const PORT = CRA_DEV_SERVER_MODE ? 3000 : 8080;

const STATIC_PATH = path.resolve(__dirname, '..', 'build');
const INDEX_HTML_PATH = path.resolve(STATIC_PATH, 'index.html');

const app: express.Application = express();

app.use('/', express.static(STATIC_PATH));
app.use('/api', api);
app.get('/*', (_, res) => res.sendFile(INDEX_HTML_PATH));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on port ${PORT}!`);
});
