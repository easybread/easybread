import { PG_CONNECTION_TYPE } from 'saas-db/enums';
import type { DtoConnection, DtoConnectionSettings } from 'saas-dto';

import { DbPostgresStrategy } from './lib/DbPostgresStrategy';

export function ConnectionSettingsForm(props: { connection: DtoConnection }) {
  switch (props.connection?.type) {
    case PG_CONNECTION_TYPE.DB_PG:
      return (
        <DbPostgresStrategy
          settings={
            props.connection.settings as Extract<
              DtoConnectionSettings,
              { type: 'DB_PG' }
            > | null
          }
          connection={props.connection}
        />
      );

    default:
      return <div>Unknown type {props.connection.type}</div>;
  }
}
