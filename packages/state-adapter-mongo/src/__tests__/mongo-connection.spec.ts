import { Db, MongoClient } from 'mongodb';

import { getMongoUrl } from './get-mongo-url';

const url = getMongoUrl() as string;

let client: MongoClient;
let db: Db;

afterAll(async () => client.close());

it(`should connect`, async () => {
  client = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  expect(client).toBeDefined();
  expect(client.isConnected()).toBe(true);
});

it(`should get db`, () => {
  db = client.db('');
  expect(db.databaseName).toEqual(expect.any(String));
});

it(`should be able to read/write`, async () => {
  const testCollection = db.collection('test');
  const newDoc = await testCollection.insertOne({ foo: 'bar' });

  expect(newDoc.result.ok).toEqual(1);

  await testCollection.drop();

  const collections = await db.collections();
  expect(collections.map(c => c.collectionName)).toEqual([]);
});
