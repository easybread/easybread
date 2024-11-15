import { playgroundDb } from '../playgroundDb';
import { ADAPTER_NAME } from 'playground-common';

export type AdapterBase = {
  slug: string;
  createdAt: Date;
  userId: string;
  connectedAt?: Date;
};

export type BambooHRAdapterConnectionMethod = 'OIDC' | 'API_KEY';

export type BambooHRAdapter = AdapterBase & {
  slug: typeof ADAPTER_NAME.BAMBOO_HR;
  companyName: string;
  connectionMethod: BambooHRAdapterConnectionMethod;
};

export type GoogleAdminDirectoryAdapter = AdapterBase & {
  slug: typeof ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY;
};

export type Adapter = BambooHRAdapter | GoogleAdminDirectoryAdapter;

export const adapterCollection = () =>
  playgroundDb().collection<Adapter>('adapters');

export function isBambooHrAdapter(
  adapter: Adapter
): adapter is BambooHRAdapter {
  return adapter.slug === ADAPTER_NAME.BAMBOO_HR;
}

export function isGoogleAdminDirectoryAdapter(
  adapter: Adapter
): adapter is GoogleAdminDirectoryAdapter {
  return adapter.slug === ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY;
}
