import { ADAPTER_NAME, type AdapterName } from 'playground-common';

export type AdapterInfo = {
  name: AdapterName;
  title: string;
  description: string;
};

export const ADAPTERS: AdapterInfo[] = [
  {
    name: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    title: 'Google Admin Directory',
    description: 'Manage resources in your Google Workspace',
  },
];
