import { ADAPTER_NAME, type AdapterName } from 'playground-common';

import { AdapterConnectGoogleAdminDirectory } from './googleAdmin/AdapterConnectGoogleAdminDirectory';
import { AdapterConnectBambooHr } from './bambooHr/AdapterConnectBambooHr';

export type AdapterConnectProps = {
  name: AdapterName;
  connectedAt?: Date;
};

export async function AdapterConnect(props: AdapterConnectProps) {
  const { name, connectedAt } = props;

  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return <AdapterConnectGoogleAdminDirectory connectedAt={connectedAt} />;
    case ADAPTER_NAME.BAMBOO_HR:
      return <AdapterConnectBambooHr connectedAt={connectedAt} />;
    default:
      return <div>Unknown adapter</div>;
  }
}
