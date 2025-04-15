import { ADAPTER_NAME, type AdapterName } from 'playground-common';
import type { Adapter } from 'playground-db';

import { AdapterConnectBambooHr } from './bambooHr/AdapterConnectBambooHr';
import { AdapterConnectBreezy } from './breezy/AdapterConnectBreezy';
import { AdapterConnectGoogleAdminDirectory } from './googleAdmin/AdapterConnectGoogleAdminDirectory';

export type AdapterConnectProps = {
  name: AdapterName;
  data: Adapter | null;
};

export async function AdapterConnect(props: AdapterConnectProps) {
  const { name, data } = props;

  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return (
        <AdapterConnectGoogleAdminDirectory connectedAt={data?.connectedAt} />
      );

    case ADAPTER_NAME.BAMBOO_HR:
      return (
        <AdapterConnectBambooHr
          connectedAt={data?.connectedAt}
          companyName={
            data && 'companyName' in data ? data.companyName : undefined
          }
        />
      );
    case ADAPTER_NAME.BREEZY:
      return <AdapterConnectBreezy connectedAt={data?.connectedAt} />;
    default:
      return <div>Unknown adapter</div>;
  }
}
