import { StateAdapterMongo } from '@easybread/state-adapter-mongo';
import { mongoClient } from 'playground-db';

export const stateAdapterMongoGet = async () => {
  return await StateAdapterMongo.fromMongoClient(mongoClient());
};
