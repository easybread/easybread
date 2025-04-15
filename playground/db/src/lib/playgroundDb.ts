import type { Db } from 'mongodb';
import { load } from 'ts-dotenv';

import { mongoClient } from './mongoClient';

let db: Db;

export const playgroundDb = () => {
  if (db) return db;

  const { MONGO_DB_NAME } = load({
    MONGO_DB_NAME: String,
  });

  return (db = mongoClient().db(MONGO_DB_NAME));
};
