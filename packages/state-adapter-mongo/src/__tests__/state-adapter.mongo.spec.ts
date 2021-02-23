import { BreadStateAdapter } from '@easybread/core';
import { Db, MongoClient, ObjectID } from 'mongodb';

import { StateAdapterMongo } from '../state-adapter.mongo';
import { getMongoUrl } from './get-mongo-url';

const url = getMongoUrl() as string;

//  ------------------------------------

let client: MongoClient;
let db: Db;
let adapterMongo: StateAdapterMongo;

beforeAll(async () => {
  client = await MongoClient.connect(
    url,
    StateAdapterMongo.DEFAULT_CLIENT_OPTIONS
  );
  db = client.db();
});

afterAll(async () => {
  client && (await client.close());
  adapterMongo && (await adapterMongo.closeConnection());
});

//  ------------------------------------

let createIndexSpy: jest.SpyInstance;

beforeEach(() => {
  createIndexSpy = jest.spyOn(db, 'createIndex');
});

afterEach(() => {
  jest.restoreAllMocks();
});

//  ------------------------------------

describe('static fromMongoClient()', () => {
  it(`should create instance`, async () => {
    adapterMongo = await StateAdapterMongo.fromMongoClient(client);
    expect(adapterMongo).toBeInstanceOf(StateAdapterMongo);
    expect(adapterMongo).toBeInstanceOf(BreadStateAdapter);
  });

  it(`should create index`, async () => {
    const info = await db.indexInformation(
      StateAdapterMongo.DEFAULT_COLLECTION_NAME
    );

    expect(info).toEqual({
      _id_: [['_id', 1]],
      // eslint-disable-next-line @typescript-eslint/camelcase
      key_1: [['key', 1]]
    });

    expect(createIndexSpy.mock.calls).toEqual([]);
  });
});

//  ------------------------------------

describe('static fromConnectionUrl', () => {
  it(`should creating instance`, async () => {
    adapterMongo = await StateAdapterMongo.fromConnectionUrl(url, {
      clientOptions: {
        useNewUrlParser: true
      }
    });
    expect(adapterMongo).toBeInstanceOf(StateAdapterMongo);
    expect(adapterMongo).toBeInstanceOf(BreadStateAdapter);
  });

  it(`should create index`, async () => {
    const info = await db.indexInformation(
      StateAdapterMongo.DEFAULT_COLLECTION_NAME
    );

    expect(info).toEqual({
      _id_: [['_id', 1]],
      // eslint-disable-next-line @typescript-eslint/camelcase
      key_1: [['key', 1]]
    });

    expect(createIndexSpy.mock.calls).toEqual([]);
  });
});

const objectValue = { foo: 'bar' };
const objectValueKey = 'test:object-value-key';

const stringValue = 'value';
const stringValueKey = 'test:string-value-key';

describe('write()', () => {
  it(`should write data to mongo db`, async () => {
    await adapterMongo.write(stringValueKey, stringValue);
    await adapterMongo.write(objectValueKey, objectValue);

    expect(
      await getCollectionData(StateAdapterMongo.DEFAULT_COLLECTION_NAME)
    ).toEqual([
      {
        _id: expect.any(ObjectID),
        key: stringValueKey,
        data: stringValue
      },
      {
        _id: expect.any(ObjectID),
        key: objectValueKey,
        data: objectValue
      }
    ]);
  });

  it(`should overwrite existing`, async () => {
    await adapterMongo.write('foo', 'bar');
    await adapterMongo.write('foo', 'baz');
    expect(
      await getCollectionData(StateAdapterMongo.DEFAULT_COLLECTION_NAME)
    ).toEqual([
      {
        _id: expect.any(ObjectID),
        key: stringValueKey,
        data: stringValue
      },
      {
        _id: expect.any(ObjectID),
        key: objectValueKey,
        data: objectValue
      },
      {
        _id: expect.any(ObjectID),
        key: 'foo',
        data: 'baz'
      }
    ]);
  });
});

describe('read()', () => {
  it(`should return an value`, async () => {
    const actualStringValue = await adapterMongo.read(stringValueKey);
    expect(actualStringValue).toEqual(stringValue);

    const actualObjectValue = await adapterMongo.read(objectValueKey);
    expect(actualObjectValue).toEqual(objectValue);
  });

  it(`should return undefined if entity does not exist`, async () => {
    expect(await adapterMongo.read('wrong')).toEqual(undefined);
  });
});

describe('remove()', () => {
  it(`should remove entity by key and return the entity`, async () => {
    const removed = await adapterMongo.remove('foo');
    expect(removed).toEqual('baz');

    const collection = db.collection(StateAdapterMongo.DEFAULT_COLLECTION_NAME);
    const data = await collection.find({}).toArray();

    expect(data.sort()).toEqual([
      {
        _id: expect.any(ObjectID),
        key: stringValueKey,
        data: stringValue
      },
      {
        _id: expect.any(ObjectID),
        key: objectValueKey,
        data: objectValue
      }
    ]);
  });
});

//  ------------------------------------

async function getCollectionData(collectionName: string): Promise<unknown[]> {
  const collection = db.collection(collectionName);
  const data = await collection.find({}).toArray();
  return data.sort();
}
