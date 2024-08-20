import { BreadStateAdapter, NotFoundException } from '@easybread/core';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';

interface MongoDBModel<T> {
  _id: string | ObjectId;
  data: T;
  key: string;
}

interface FromConnectionURLOptions {
  collectionName?: string;
  clientOptions?: MongoClientOptions;
  createIndex?: boolean;
}

interface FromMongoClientOptions {
  collectionName?: string;
  createIndex?: boolean;
}

export class StateAdapterMongo extends BreadStateAdapter {
  static readonly DEFAULT_COLLECTION_NAME = 'easybread';
  static readonly DEFAULT_CLIENT_OPTIONS: MongoClientOptions = {};

  private constructor(
    private readonly client: MongoClient,
    private readonly collectionName: string = StateAdapterMongo.DEFAULT_COLLECTION_NAME
  ) {
    super();
  }

  static async fromMongoClient(
    client: MongoClient,
    options: FromMongoClientOptions = {}
  ): Promise<StateAdapterMongo> {
    const { collectionName, createIndex = true } = options;

    createIndex && (await this.createIndex(client, collectionName));

    return new StateAdapterMongo(client, collectionName);
  }

  static async fromConnectionUrl(
    connectionURI: string,
    options: FromConnectionURLOptions = {}
  ): Promise<StateAdapterMongo> {
    const { collectionName, createIndex, clientOptions } = options;

    const client = await this.createMongoClient(connectionURI, clientOptions);

    return this.fromMongoClient(client, {
      createIndex,
      collectionName,
    });
  }

  static async createIndex(
    client: MongoClient,
    collectionName: string = this.DEFAULT_COLLECTION_NAME
  ): Promise<void> {
    await client.db().createIndex(collectionName, 'key', {
      unique: true,
    });
  }

  private static createMongoClient(
    connectionURI: string,
    clientOptions: MongoClientOptions = {}
  ): Promise<MongoClient> {
    return MongoClient.connect(connectionURI, {
      ...StateAdapterMongo.DEFAULT_CLIENT_OPTIONS,
      ...clientOptions,
    });
  }

  async closeConnection(): Promise<void> {
    await this.client.close();
  }

  async read<T>(key: string): Promise<T | undefined> {
    const doc = await this.findByKey<T>(key);
    if (!doc) return undefined;
    return doc.data;
  }

  async remove<T>(key: string): Promise<T> {
    const entity = await this.findByKey<T>(key);

    if (!entity) throw new NotFoundException();

    await this.removeByKey(key);

    return entity.data;
  }

  async write<T>(key: string, value: T): Promise<T> {
    await this.upsertByKey(key, value);
    return value;
  }

  private async removeByKey(key: string): Promise<boolean> {
    const collection = await this.getCollection();
    const res = await collection.findOneAndDelete(
      { key: key },
      { includeResultMetadata: true }
    );
    return res !== null && res.ok === 1;
  }

  private async upsertByKey<T>(key: string, data: T): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne({ key }, { $set: { data } }, { upsert: true });
  }

  private async findByKey<T>(key: string): Promise<MongoDBModel<T> | null> {
    const collection = await this.getCollection();
    const item = await collection.findOne({ key });
    return (item as MongoDBModel<T>) || null;
  }

  private async getCollection(): Promise<Collection> {
    await this.ensureConnection();
    return this.client.db().collection(this.collectionName);
  }

  // TODO: this is probably no longer needed.
  private async ensureConnection(): Promise<void> {
    await this.client.connect();
  }
}
