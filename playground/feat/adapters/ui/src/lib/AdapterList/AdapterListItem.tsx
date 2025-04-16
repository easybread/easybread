import { adapterStatusGet } from 'playground-feat-adapters-data';

import { AdapterConnect } from '../AdapterConnect/AdapterConnect';

import { AdapterExtraInfo } from './AdapterExtraInfo';
import type { AdapterInfo } from './adapters';

export type AdapterListItemProps = {
  info: AdapterInfo;
};

export async function AdapterListItem(props: AdapterListItemProps) {
  const { name, title, description } = props.info;

  const adapterData = await adapterStatusGet(name);

  return (
    <div className={'flex flex-col rounded-lg bg-white p-4 shadow-md'}>
      <h2 className={'text-xl font-bold'}>{title}</h2>

      <p className={'mb-2 h-full'}>{description}</p>

      <AdapterExtraInfo data={adapterData} />

      <div className={'flex flex-col'}>
        <AdapterConnect name={name} data={adapterData} />
      </div>
    </div>
  );
}
