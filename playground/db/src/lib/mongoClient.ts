import { MongoClient } from 'mongodb';
import { load } from 'ts-dotenv';

let client: MongoClient;

export const mongoClient = () => {
  if (client) return client;

  const { MONGO_HOST, MONGO_PASSWORD, MONGO_USER } = load({
    MONGO_USER: String,
    MONGO_PASSWORD: String,
    MONGO_HOST: String,
  });

  return new MongoClient(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017`
  );
};
