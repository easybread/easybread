import { MongoClient } from 'mongodb';
import { load } from 'ts-dotenv';

const { MONGO_HOST, MONGO_PASSWORD, MONGO_USER } = load({
  MONGO_USER: String,
  MONGO_PASSWORD: String,
  MONGO_HOST: String,
});

export const mongoClient = new MongoClient(
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017`
);
