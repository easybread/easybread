export function getMongoUrl(): string {
  const URL = process.env['MONGO_URL'] as string;

  const DB_NAME = (global as typeof globalThis & { __MONGO_DB_NAME__: string })
    .__MONGO_DB_NAME__;

  return URL.split('/').slice(0, -1).join('/') + `/${DB_NAME}`;
}
