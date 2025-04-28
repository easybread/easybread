'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { PG_CONNECTION_TYPE, type PgConnectionType } from 'saas-pg/enums';
import { useTRPC } from 'saas-trpc';

import { Button } from '../../shadcn/button';
import { Input } from '../../shadcn/input';
import { SelectBox, type SelectBoxData } from '../Select/SelectBox';

type ConnectionTypeItem = {
  label: string;
  value: PgConnectionType;
};
const connectionTypeItems: SelectBoxData<ConnectionTypeItem> = [
  {
    label: 'EasyBREAD',
    items: [
      { label: 'Bamboo HR', value: PG_CONNECTION_TYPE.EB_BAMBOO },
      { label: 'Breezy', value: PG_CONNECTION_TYPE.EB_BREEZY },
      {
        label: 'Google Admin Directory',
        value: PG_CONNECTION_TYPE.EB_GOOGLE_ADMIN_DIRECTORY,
      },
      {
        label: 'Google Contacts',
        value: PG_CONNECTION_TYPE.EB_GOOGLE_CONTACTS,
      },
      {
        label: 'Rocket Chat Users',
        value: PG_CONNECTION_TYPE.EB_ROCKET_CHAT_USERS,
      },
    ],
  },
  {
    label: 'Databases',
    items: [
      { label: 'Postgres', value: PG_CONNECTION_TYPE.DB_PG },
      { label: 'MySQL', value: PG_CONNECTION_TYPE.DB_MYSQL },
      { label: 'MongoDB', value: PG_CONNECTION_TYPE.DB_MONGO },
    ],
  },
];

export function ConnectionsListAddForm(props: { callback: () => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');

  const [connectionType, setConnectionType] = useState<
    PgConnectionType | undefined
  >(undefined);

  const listQueryKey = trpc.connections.list.queryKey();

  const mutation = useMutation(
    trpc.connections.create.mutationOptions({
      onMutate: () => {
        toast.info('Adding a connection...');
      },
      onSuccess: connection => {
        queryClient.setQueryData(listQueryKey, prev => ({
          data: [...(prev?.data ?? []), connection],
        }));
        void queryClient.invalidateQueries({ queryKey: listQueryKey });
        toast.success('Connection added');
        props.callback();
      },
      onError: err => {
        console.log(err);
        toast.error('Failed to add connection');
      },
    }),
  );

  const addConnection = () => {
    if (!name || !connectionType) return;
    mutation.mutate({ name, type: connectionType });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2">
        <SelectBox<ConnectionTypeItem, PgConnectionType>
          data={connectionTypeItems}
          onChange={setConnectionType}
          toItemLabel={i => i.label}
          toValue={i => i.value}
          value={connectionType}
          placeholder="Connection type"
          className={'w-full'}
        />
        <Input
          className={'w-full'}
          placeholder="Enter your connection name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <Button onClick={addConnection} disabled={!name || !connectionType}>
        {mutation.isPending ? 'Adding...' : 'Add Connection'}
      </Button>
    </div>
  );
}
