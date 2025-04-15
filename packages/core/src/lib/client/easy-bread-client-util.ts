import type {
  ServiceAdapterAny,
  inferServiceAdapterCommandByName,
  inferServiceAdapterCommandName,
} from '../service-adapter';

import type { EasyBreadClient } from './easy-bread-client';

export type EasyBreadClientAny = EasyBreadClient<ServiceAdapterAny>;

export type inferEasyBreadClientServiceAdapter<T extends EasyBreadClientAny> =
  T['serviceAdapter'];

export type inferEasyBreadClientCommandName<
  TClient extends EasyBreadClientAny,
> = inferServiceAdapterCommandName<inferEasyBreadClientServiceAdapter<TClient>>;

export type inferEasyBreadClientCommandByName<
  TClient extends EasyBreadClientAny,
  TName extends inferEasyBreadClientCommandName<TClient>,
> = inferServiceAdapterCommandByName<
  inferEasyBreadClientServiceAdapter<TClient>,
  TName
>;
