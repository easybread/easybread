import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AdaptersPage } from './pages/adapters';
import { OperationsPage } from './pages/operations';

interface AppRoutesProps {}

export const AppRoutes: FC<AppRoutesProps> = () => {
  return (
    <Switch>
      <Route path={'/adapters'}>
        <AdaptersPage />
      </Route>

      <Route path={'/operations'}>
        <OperationsPage />
      </Route>

      <Redirect from={'/'} to={'/adapters'} />
    </Switch>
  );
};
