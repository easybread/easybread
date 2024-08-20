import { Db, MongoClient } from 'mongodb';

import { getMongoUrl } from './get-mongo-url';

const url = getMongoUrl() as string;

let client: MongoClient;
let db: Db;

afterAll(async () => client.close());

it(`should connect`, async () => {
  client = await MongoClient.connect(url, {});
  expect(client).toBeDefined();
  await expect(client.connect()).resolves.not.toThrow();
});

it(`should get db`, () => {
  db = client.db('');
  expect(db.databaseName).toEqual(expect.any(String));
});

it(`should be able to read/write`, async () => {
  const testCollection = db.collection('test');
  const newDoc = await testCollection.insertOne({ foo: 'bar' });

  expect(newDoc.acknowledged).toBe(true);
  expect(newDoc.acknowledged && newDoc.insertedId).toBeDefined();

  await testCollection.drop();

  const collections = await db.collections();
  expect(collections.map((c) => c.collectionName)).toEqual([]);
});
