import { Collection, MongoClient } from 'mongodb';

import { BreadStateAdapter } from '../state';

export class MongoDbStateAdapter extends BreadStateAdapter {
  static DEFAULT_COLLECTION_NAME = 'easybread_state';

  constructor(
    private readonly connectionUri: string,
    private readonly collectionName: string = MongoDbStateAdapter.DEFAULT_COLLECTION_NAME
  ) {
    super();
  }

  async read<T>(key: string): Promise<T | undefined> {
    const client = await this.connect();

    const doc = await this.getCollection(client).findOne({ _id: key });

    await this.disconnect(client);

    return this.getDocumentData<T>(doc);
  }

  async remove(key: string): Promise<void> {
    const client = await this.connect();

    await this.getCollection(client).findOneAndDelete({ _id: key });

    await this.disconnect(client);
  }

  async write<T>(key: string, value: T): Promise<T> {
    const client = await this.connect();

    await this.getCollection(client).updateOne(
      { _id: key },
      { $set: this.createDocument(key, value) },
      { upsert: true }
    );

    await this.disconnect(client);

    return value;
  }

  private createDocument<T>(key: string, data: T): MongoStateDocument<T> {
    return { _id: key, data };
  }

  private getDocumentData<T>(document: MongoStateDocument<T>): T {
    return document.data;
  }

  private getCollection(client: MongoClient): Collection {
    return client.db().collection(this.collectionName);
  }

  private async connect(): Promise<MongoClient> {
    return MongoClient.connect(this.connectionUri);
  }

  private async disconnect(client: MongoClient): Promise<void> {
    await client.close();
  }
}

interface MongoStateDocument<T> {
  _id: string;
  data: T;
}
