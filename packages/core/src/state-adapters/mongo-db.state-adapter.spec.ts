import { getUrl, start, stop } from 'mongo-unit';
import { MongoClient } from 'mongodb';

import { MongoDbStateAdapter } from './mongo-db.state-adapter';

let MONGO_URI: string;

let client: MongoClient;
let adapter: MongoDbStateAdapter;

beforeAll(async () => {
  await start();

  MONGO_URI = getUrl();

  client = await MongoClient.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  adapter = new MongoDbStateAdapter(MONGO_URI);
});

afterAll(async () => {
  await client.close();
  await stop();
});

beforeEach(async () => {
  await client
    .db()
    .collection(MongoDbStateAdapter.DEFAULT_COLLECTION_NAME)
    .deleteMany({});
});

describe('write', () => {
  it(`should create a correct record in the db`, async () => {
    await adapter.write(adapter.createStateKey(['foo', 'bar', 'baz']), {
      test: 'value'
    });

    const all = await client
      .db()
      .collection(MongoDbStateAdapter.DEFAULT_COLLECTION_NAME)
      .find()
      .toArray();

    expect(all).toEqual([
      {
        _id: 'foo:bar:baz',
        data: { test: 'value' }
      }
    ]);
  });

  it(`should return the value`, async () => {
    const res = await adapter.write(
      adapter.createStateKey(['foo', 'bar', 'baz']),
      { test: 'value' }
    );
    expect(res).toEqual({ test: 'value' });
  });

  it(`should allow overwriting the same key`, async () => {
    const key = adapter.createStateKey(['foo', 'bar', 'baz']);

    await adapter.write(key, { test: 'value' });
    const updated = await adapter.write(key, { test: 'newvalue' });

    const all = await client
      .db()
      .collection(MongoDbStateAdapter.DEFAULT_COLLECTION_NAME)
      .find()
      .toArray();

    expect(all).toEqual([
      {
        _id: 'foo:bar:baz',
        data: { test: 'newvalue' }
      }
    ]);

    expect(updated).toEqual({ test: 'newvalue' });
  });
});

describe('read', () => {
  it(`should return the data`, async () => {
    const key = adapter.createStateKey(['foo', 'bar']);
    await adapter.write(key, {
      test: 'value'
    });

    const actual = await adapter.read(key);

    expect(actual).toEqual({ test: 'value' });
  });
});

describe('remove', () => {
  it(`should remove the record`, async () => {
    const key = adapter.createStateKey(['foo', 'bar']);
    await adapter.write(key, { test: 'value' });

    await adapter.remove(key);

    const all = await client
      .db()
      .collection(MongoDbStateAdapter.DEFAULT_COLLECTION_NAME)
      .find()
      .toArray();

    expect(all).toEqual([]);
  });
});
