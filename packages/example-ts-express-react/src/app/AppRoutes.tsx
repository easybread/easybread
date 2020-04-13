import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AdaptersPage } from './pages/adapters';
import { CompleteGoogleOAuth2Page } from './pages/oauth';
import { PeoplePage } from './pages/people';
import { FetchResult, RefetchFunction } from './hooks/http/interfaces';
import { AdaptersStateDto } from '../dtos';

interface AppRoutesProps {
  adaptersData: FetchResult<AdaptersStateDto>;
  refetch: RefetchFunction;
}

export const AppRoutes: FC<AppRoutesProps> = ({ adaptersData, refetch }) => {
  return (
    <Switch>
      <Route path={'/adapters'}>
        <AdaptersPage adaptersData={adaptersData} refetch={refetch} />
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
