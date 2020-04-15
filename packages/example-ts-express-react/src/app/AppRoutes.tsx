import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AdaptersPage } from './pages/adapters';
import { CompleteGoogleOAuth2Page } from './pages/oauth';
import { PeoplePage } from './pages/people';

interface AppRoutesProps {}

export const AppRoutes: FC<AppRoutesProps> = () => {
  return (
    <Switch>
      <Route path={'/adapters'}>
        <AdaptersPage />
      </Route>

      <Route path={'/people'}>
        <PeoplePage />
      </Route>

      <Route path={'/complete-google-auth'}>
        <CompleteGoogleOAuth2Page />
      </Route>

      <Redirect from={'/'} to={'/adapters'} />
    </Switch>
  );
};
