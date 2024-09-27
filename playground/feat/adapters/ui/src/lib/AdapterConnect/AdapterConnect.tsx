import { AdapterConnectGoogleAdminDirectory } from './AdapterConnectGoogleAdminDirectory';
import { ADAPTER_NAME, type AdapterName } from 'playground-common';

export type AdapterConnectProps = {
  name: AdapterName;
  connectedAt?: Date;
};

export async function AdapterConnect(props: AdapterConnectProps) {
  const { name, connectedAt } = props;

  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return <AdapterConnectGoogleAdminDirectory connectedAt={connectedAt} />;
    default:
      return <div>Unknown adapter</div>;
  }
}
