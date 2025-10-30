import type { PgConnectionType } from 'saas-db/enums';

import { Badge } from '../../../shadcn/badge';

const typeMap: Record<PgConnectionType, string> = {
  DB_MONGO: 'Mongo',
  DB_MYSQL: 'MySQL',
  DB_PG: 'Postgres',
  EB_BAMBOO: 'Bamboo HR',
  EB_BREEZY: 'Breezy',
  EB_GOOGLE_ADMIN_DIRECTORY: 'Google Admin Directory',
  EB_GOOGLE_CONTACTS: 'Google Contacts',
  EB_ROCKET_CHAT_USERS: 'RocketChat Users',
};

export function ConnectionTypeBadge({ type }: { type: PgConnectionType }) {
  return <Badge variant="secondary">{typeMap[type]}</Badge>;
}
