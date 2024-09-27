import { AdapterConnect } from '../AdapterConnect/AdapterConnect';
import type { AdapterInfo } from './adapters';
import { adapterStatusGet } from 'playground-feat-adapters-data';

export type AdapterListItemProps = {
  info: AdapterInfo;
};

export async function AdapterListItem(props: AdapterListItemProps) {
  const { name, title, description } = props.info;
  const adapterData = await adapterStatusGet(name);

  return (
    <div className={'flex flex-col p-4 bg-white rounded-lg shadow-md'}>
      <h2 className={'text-xl font-bold'}>{title}</h2>
      <p className={'text-md mb-2'}>{description}</p>
      <div className={'flex flex-col'}>
        <AdapterConnect name={name} connectedAt={adapterData?.createdAt} />
      </div>
    </div>
  );
}
