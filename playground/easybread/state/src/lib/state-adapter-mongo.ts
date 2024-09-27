import { StateAdapterMongo } from '@easybread/state-adapter-mongo';
import { mongoClient } from 'playground-db';

export const stateAdapterMongo = async () => {
  return await StateAdapterMongo.fromMongoClient(mongoClient());
};
