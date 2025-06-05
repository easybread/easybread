import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query';

import { trpcTransformer } from '../trpcTransformer';

export const makeReactQueryClient = () => {
  console.log('MAKING_QUERY_CLIENT!!!');
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: trpcTransformer.serialize,
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: trpcTransformer.deserialize,
      },
    },
  });
};
