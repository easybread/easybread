import { playgroundDb } from '../playgroundDb';
import type { AdapterName } from 'playground-common';

export type Adapter = {
  slug: AdapterName;
  createdAt: Date;
  userId: string;
  connectionToken?: string;
  isConnected: boolean;
};

export const adapterCollection = () =>
  playgroundDb().collection<Adapter>('adapters');
