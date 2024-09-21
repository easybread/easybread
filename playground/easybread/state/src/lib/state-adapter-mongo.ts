import { StateAdapterMongo } from '@easybread/state-adapter-mongo';
import { mongoClient } from 'playground-db';

export const stateAdapterMongo = await StateAdapterMongo.fromMongoClient(
  mongoClient
);
