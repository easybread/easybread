import type { Adapter } from 'playground-db';
import { Pill } from 'playground-ui';

export type AdapterExtraInfoProps = {
  data?: Adapter | null;
};

export function AdapterExtraInfo(props: AdapterExtraInfoProps) {
  const { data } = props;

  if (!data) return null;

  switch (data.slug) {
    case 'BAMBOO_HR':
      return (
        <div className="mb-2 flex gap-2">
          <Pill className="bg-amber-200">{data.companyName}</Pill>
          <Pill className="bg-gray-200">{data.connectionMethod}</Pill>
        </div>
      );
    case 'GOOGLE_ADMIN_DIRECTORY':
      return (
        <div className="mb-2 flex gap-2">
          <Pill className="bg-gray-200">OAuth2.0</Pill>
        </div>
      );

    default:
      return null;
  }
}
