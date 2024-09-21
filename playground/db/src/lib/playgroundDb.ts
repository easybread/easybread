import { mongoClient } from './mongoClient';
import { load } from 'ts-dotenv';

const { MONGO_DB_NAME } = load({
  MONGO_DB_NAME: String,
});

export const playgroundDb = mongoClient.db(MONGO_DB_NAME);
