'use client';

import { useState } from 'react';

import { ADAPTER_NAME } from 'playground-common';
import { Button, Icon, Input } from 'playground-ui';
import {
  adapterDisconnectAction,
  bambooHrConnectAction,
} from 'playground-feat-adapters-actions';
import type { BambooHRAdapterConnectionMethod } from 'playground-db';

export type AdapterConnectBambooHrProps = {
  connectedAt?: Date;
  companyName?: string;
};

export function AdapterConnectBambooHr(props: AdapterConnectBambooHrProps) {
  const { connectedAt } = props;

  const [mode, setMode] = useState<BambooHRAdapterConnectionMethod>('API_KEY');

  const isConnected = connectedAt !== undefined;

  const disconnectAction = adapterDisconnectAction.bind(
    null,
    ADAPTER_NAME.BAMBOO_HR
  );

  return isConnected ? (
    <form action={disconnectAction} className={'flex flex-col'}>
      <Button type={'submit'} variant={'outline'} size={'md'}>
        <Icon iconName={'BAMBOO_HR'} size={'xs'} className={'mr-2'} />
        <span>Disconnect</span>
      </Button>
    </form>
  ) : (
    <form action={bambooHrConnectAction} className={'flex flex-col'}>
      <div className={'flex gap-4 mb-4'}>
        <label
          className={'flex items-center cursor-pointer'}
          htmlFor={'mode-api-key'}
        >
          <input
            id={'mode-api-key'}
            type="radio"
            name="mode"
            value="API_KEY"
            checked={mode === 'API_KEY'}
            onChange={() => setMode('API_KEY')}
            className={'mr-2'}
          />
          API Key
        </label>
        <label
          className={'flex items-center cursor-pointer'}
          htmlFor={'mode-oidc'}
        >
          <input
            id={'mode-oidc'}
            type="radio"
            name="mode"
            value="OIDC"
            checked={mode === 'OIDC'}
            onChange={() => setMode('OIDC')}
            className={'mr-2'}
          />
          OIDC
        </label>
      </div>

      <div className={'flex flex-col gap-2'}>
        {mode === 'API_KEY' ? (
          <Input type="password" name="apiKey" placeholder={'API Key'} />
        ) : null}
        <Input type="text" name="companyName" placeholder={'Company Name'} />
        <Button type={'submit'} variant={'outline'} size={'md'}>
          <Icon iconName={'BAMBOO_HR'} size={'xs'} className={'mr-2'} />
          <span>Connect</span>
        </Button>
      </div>
    </form>
  );
}
