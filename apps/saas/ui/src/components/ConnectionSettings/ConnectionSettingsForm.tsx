import { PG_CONNECTION_TYPE, type PgConnectionType } from 'saas-pg/enums';

import { DbPostgresStrategy } from './lib/DbPostgresStrategy';

export function ConnectionSettingsForm(props: {
  connectionType: PgConnectionType;
}) {
  switch (props.connectionType) {
    case PG_CONNECTION_TYPE.DB_PG:
      return <DbPostgresStrategy />;

    default:
      return <div>Unknown type {props.connectionType}</div>;
  }
}
