import { Button, Icon } from 'playground-ui';
import { ADAPTER_NAME } from 'playground-common';
import {
  adapterDisconnectAction,
  adapterGoogleAdminDirectoryConnectAction,
} from 'playground-feat-adapters-actions';

export type AdapterConnectGoogleAdminDirectoryProps = {
  connectedAt?: Date;
};

export async function AdapterConnectGoogleAdminDirectory(
  props: AdapterConnectGoogleAdminDirectoryProps
) {
  const { connectedAt } = props;

  const isConnected = connectedAt !== undefined;

  const disconnectAction = adapterDisconnectAction.bind(
    null,
    ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY
  );

  return isConnected ? (
    <form action={disconnectAction} className={'flex flex-col'}>
      <Button type={'submit'} variant={'outline'} size={'md'}>
        <Icon iconName={'GOOGLE_G_LETTER'} size={'xs'} className={'mr-2'} />
        <span>Disconnect</span>
      </Button>
    </form>
  ) : (
    <form
      action={adapterGoogleAdminDirectoryConnectAction}
      className={'flex flex-col'}
    >
      <Button type={'submit'} variant={'outline'} size={'md'}>
        <Icon iconName={'GOOGLE_G_LETTER'} size={'xs'} className={'mr-2'} />
        <span>Connect</span>
      </Button>
    </form>
  );
}
