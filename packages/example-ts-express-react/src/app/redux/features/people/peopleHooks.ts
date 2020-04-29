import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Person } from 'schema-dts';

import { RootState } from '../../rootReducer';
import { peopleDelete } from './peopleDelete';
import { AdapterName, PersonInfo } from './peopleSlice';
import { peopleUpdate } from './peopleUpdate';

export function useCreatingPerson(): boolean {
  return useSelector<RootState, boolean>(state => {
    return (
      state.people.creatingPerson.bamboo || state.people.creatingPerson.google
    );
  });
}

export function usePersonInfosArray(): PersonInfo[] {
  return useSelector<RootState, PersonInfo[]>(state =>
    state.people.ids.map(id => state.people.byId[id])
  );
}

export function useDispatchPersonUpdate(): (
  adapter: AdapterName,
  person: Person
) => void {
  const dispatch = useDispatch();

  return useCallback(
    (adapter: AdapterName, person: Person) => {
      dispatch(peopleUpdate(adapter, person));
    },
    [dispatch]
  );
}
export function useDispatchPersonDelete(): (
  adapter: AdapterName,
  person: Person
) => void {
  const dispatch = useDispatch();

  return useCallback(
    (adapter: AdapterName, person: Person) => {
      dispatch(peopleDelete(adapter, person));
    },
    [dispatch]
  );
}
