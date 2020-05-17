import React, { FC } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { ADAPTER_NAME } from '../../../common';
import {
  useAdapterConfigured,
  useAdaptersInitialized,
  useAdaptersLoading
} from '../../redux/features/adapters';
import { PeoplePageDetails } from './PeoplePageDetails';
import { PeoplePageList } from './PeoplePageList';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  const match = useRouteMatch();

  const adaptersLoading = useAdaptersLoading();
  const adaptersInitialized = useAdaptersInitialized();

  const bambooConfigured = useAdapterConfigured(ADAPTER_NAME.BAMBOO);
  const googleConfigured = useAdapterConfigured(ADAPTER_NAME.GOOGLE_CONTACTS);
  const gsuiteConfigured = useAdapterConfigured(ADAPTER_NAME.GSUITE_ADMIN);

  const canNavigate = bambooConfigured || googleConfigured || gsuiteConfigured;

  if (adaptersInitialized && !adaptersLoading && !canNavigate) {
    return <Redirect to={'/'} />;
  }

  return (
    <Switch>
      <Route path={match.path} exact={true}>
        <PeoplePageList />
      </Route>
      <Route path={`${match.path}/:adapter/:identifier`}>
        <PeoplePageDetails />
      </Route>
    </Switch>
  );
};
