'use client';

import { useQuery } from '@tanstack/react-query';

import { useTRPC } from 'saas-trpc';

export function ClientComp() {
  const trpc = useTRPC();
  const query = useQuery(trpc.hello.queryOptions({ name: 'Alexandr' }));
  // if (query.isLoading) return <div>Loading...</div>;
  return <div>{query.data?.greeting}</div>;
}
