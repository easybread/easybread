export function getMongoUrl(): string {
  const URL = process.env.MONGO_URL as string;
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  const DB_NAME = global.__MONGO_DB_NAME__ as string;

  return URL.split('/').slice(0, -1).join('/') + `/${DB_NAME}`;
}
