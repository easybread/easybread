import { Cog, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import type { PgConnectionSelect } from 'saas-db/types';

import { Card, CardFooter, CardHeader, CardTitle } from '../../shadcn/card';

import { useConnectionDeleteContext } from './ConnectionDelete';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { ConnectionTypeBadge } from './ConnectionTypeBadge';

export function ConnectionsListItemCard(props: { data: PgConnectionSelect }) {
  const { name, type, id, isConnected } = props.data;

  const { connectionDelete, connectionDeleteInProgressIds } =
    useConnectionDeleteContext();

  const isDeleting = useMemo(
    () => connectionDeleteInProgressIds.has(id),
    [id, connectionDeleteInProgressIds],
  );

  return (
    <Card
      className={`relative justify-between gap-2 data-[state=deleting]:animate-out
        data-[state=deleting]:fade-out-0 data-[state=deleting]:fill-mode-forwards
        data-[state=deleting]:zoom-out-50 data-[state=idle]:animate-in
        data-[state=idle]:fade-in-0 data-[state=idle]:zoom-in-50`}
      data-state={isDeleting ? 'deleting' : 'idle'}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="w-full">
            <Link href={`/connections/${id}`}>{name}</Link>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Trash
              className="h-5 cursor-pointer opacity-50 hover:opacity-100"
              onClick={() => connectionDelete(props.data)}
            />
          </div>
        </div>
      </CardHeader>

      <CardFooter className="mt-3">
        <div className="flex w-full items-center gap-2">
          <ConnectionTypeBadge type={type} />

          <div className="flex w-full items-center justify-end gap-2">
            <Cog
              className="h-5 cursor-pointer opacity-50 hover:opacity-100"
              onClick={() => console.log('edit', props.data)}
            />
            <ConnectionStatusIndicator
              isConnected={isConnected}
              onConnectClick={() => console.log('edit', props.data)}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
