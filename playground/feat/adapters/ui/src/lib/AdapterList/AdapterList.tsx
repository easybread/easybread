import { AdapterListItem } from './AdapterListItem';
import { ADAPTERS } from './adapters';

export type AdapterListProps = {
  //
};

export async function AdapterList(props: AdapterListProps) {
  return (
    <div className={'grid grid-cols-2 gap-4 md:grid-cols-3'}>
      {ADAPTERS.map((info) => (
        <AdapterListItem key={info.name} info={info} />
      ))}
    </div>
  );
}
