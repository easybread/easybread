import type { ReactNode } from 'react';

import { TrpcReactProvider } from 'saas-trpc';

export function Providers({ children }: { children: ReactNode }) {
  return <TrpcReactProvider>{children}</TrpcReactProvider>;
}
