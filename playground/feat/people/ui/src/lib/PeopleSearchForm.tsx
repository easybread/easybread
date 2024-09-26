'use client';

import { Button, Input, Select, type SelectOption } from 'playground-ui';
import { type FormEventHandler, useMemo, useState } from 'react';
import { ADAPTER_NAME, type AdapterName } from 'playground-common';
import { peopleSearchAction } from './peopleSearchAction';
import type { PersonSchema } from '@easybread/schemas';
import { clsx } from 'clsx';
import type { Adapter, SerializedDoc } from 'playground-db';
import Link from 'next/link';

export type PeopleSearchFormProps = {
  onData: (people: PersonSchema[]) => void;
  adapters?: SerializedDoc<Adapter>[];
  className?: string;
};

const ADAPTERS_SELECT_OPTIONS: SelectOption<AdapterName>[] = [
  {
    value: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    label: 'Google Admin Directory',
  },
  {
    value: ADAPTER_NAME.BAMBOO_HR,
    label: 'Bamboo HR',
  },
];

export function PeopleSearchForm(props: PeopleSearchFormProps) {
  const { onData, className, adapters } = props;

  const availableAdapters = useMemo(() => {
    if (!adapters) return [];
    return ADAPTERS_SELECT_OPTIONS.filter((a) => {
      return adapters.some((b) => a.value === b.slug && b.isConnected);
    });
  }, [adapters]);

  const [query, setQuery] = useState('');
  const [adapter, setAdapter] = useState<AdapterName>(
    ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY
  );
  const [state, setState] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);

  const search: FormEventHandler = (e) => {
    e.preventDefault();
    setState('loading');

    peopleSearchAction({ query, adapter }).then((r) => {
      if (r.rawPayload.success) {
        onData(r.payload);
      } else {
        console.error(r.rawPayload.error);
        setError(
          typeof r.rawPayload.error === 'string'
            ? r.rawPayload.error
            : (r.rawPayload.error as { message: string }).message
        );
      }
      setState('idle');
    });
  };

  if (!availableAdapters.length) {
    return (
      <div className={clsx('flex flex-col gap-2', className)}>
        <p>No adapters available. Please connect one.</p>

        <Link
          className={'text-md font-bold text-blue-600 hover:text-blue-400'}
          href={'/adapters'}
        >
          Go to Adapters
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={search} className={clsx('flex flex-col gap-2', className)}>
      <div className={'flex gap-2'}>
        <Select
          options={availableAdapters}
          value={adapter}
          onChange={setAdapter}
          size={'md'}
          variant={'outline'}
          className={'min-w-64 bg-white'}
        />
        <Input
          autoFocus
          disabled={state === 'loading'}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type={'submit'}
          disabled={state === 'loading'}
          className={'min-w-36'}
        >
          {state === 'loading' ? 'Loading...' : 'Search'}
        </Button>
      </div>

      {error && (
        <div className={'text-red-500 flex flex-col'}>
          <p>{error}</p>
        </div>
      )}
    </form>
  );
}
