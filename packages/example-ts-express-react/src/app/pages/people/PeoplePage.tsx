import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { PeoplePageDetails } from './PeoplePageDetails';
import { PeoplePageList } from './PeoplePageList';

interface OperationsPageProps {}

export const PeoplePage: FC<OperationsPageProps> = () => {
  const match = useRouteMatch();
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
