import { ADAPTER_NAME } from 'playground-common';
import { Button, Icon, Input } from 'playground-ui';

import { adapterDisconnectAction } from '../adapterDisconnectAction';
import { connectAction } from './connectAction';

export type AdapterConnectBambooHrProps = {
  connectedAt?: Date;
};

export async function AdapterConnectBambooHr(
  props: AdapterConnectBambooHrProps
) {
  const { connectedAt } = props;

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
    <form action={connectAction} className={'flex flex-col'}>
      <div className={'flex flex-col gap-2'}>
        <Input type="password" name="apiKey" placeholder={'API Key'} />
        <Input type="text" name="companyName" placeholder={'Company Name'} />
        <Button type={'submit'} variant={'outline'} size={'md'}>
          <Icon iconName={'BAMBOO_HR'} size={'xs'} className={'mr-2'} />
          <span>Connect</span>
        </Button>
      </div>
    </form>
  );
}
