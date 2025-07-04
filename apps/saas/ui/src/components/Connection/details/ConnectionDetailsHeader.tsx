'use client';

import type { DtoConnection, DtoConnectionSettings } from 'saas-dto';

import { Button } from '../../../shadcn/button';
import { useConnectionEdit } from '../settings/ConnectionSettingsEdit';

export function ConnectionDetailsHeader({
  connection,
}: {
  connection: DtoConnection;
}) {
  const { settings, name } = connection;
  const { connectionEdit } = useConnectionEdit();

  return (
    <div className="flex items-center gap-2">
      <div className="flex grow flex-col overflow-hidden">
        <span>{name}</span>
        <ConnectionSettingsView settings={settings} />
      </div>
      <Button onClick={() => connectionEdit(connection.id)}>
        {connection.isConnected ? 'Edit' : 'Connect'}
      </Button>
    </div>
  );
}

export function ConnectionSettingsView({
  settings,
}: {
  settings: DtoConnectionSettings | null;
}) {
  if (!settings) return null;

  if (settings.type !== 'DB_PG') {
    return <span>Connection {settings.type} is not supported yet</span>;
  }

  return (
    <div className="flex flex-col gap-1 overflow-hidden font-mono text-xs text-muted-foreground">
      {/* <ConnectionTypeBadge type={settings.type} /> */}
      <span className="truncate">{settings.connectionString}</span>
    </div>
  );
}
