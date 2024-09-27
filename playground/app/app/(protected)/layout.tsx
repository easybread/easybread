'use client';

import { type PropsWithChildren, useLayoutEffect, useState } from 'react';
import { authorizeAction } from './authorizeAction';

export default function ProtectedLayout(props: PropsWithChildren) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useLayoutEffect(() => {
    void authorizeAction().then(() => {
      setIsAuthorized(true);
    });
  }, []);

  if (!isAuthorized) return null;

  return <>{props.children}</>;
}
