import { BambooEmployee } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsFeedEntry } from '@easybread/adapter-google-contacts';
import { GsuiteAdminUser } from '@easybread/adapter-gsuite-admin';
import { PersonSchema } from '@easybread/schemas';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ADAPTER_NAME } from '../../../../common';
import { RootState } from '../../rootReducer';
import {
  createPersonInfoStateId,
  createPersonInfoStateIdFromPersonInfo,
  PersonInfo
} from './peopleCommon';
import { peopleDelete } from './peopleDelete';
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
    state.people.data.ids.map(id => state.people.data.byId[id])
  );
}

export function useDispatchPersonUpdate(): (
  adapter: ADAPTER_NAME,
  person: PersonSchema
) => void {
  const dispatch = useDispatch();

  return useCallback(
    (adapter: ADAPTER_NAME, person: PersonSchema) => {
      dispatch(peopleUpdate(adapter, person));
    },
    [dispatch]
  );
}

export function useDispatchPersonDelete(): (
  adapter: ADAPTER_NAME,
  person: PersonSchema
) => void {
  const dispatch = useDispatch();

  return useCallback(
    (adapter: ADAPTER_NAME, person: PersonSchema) => {
      dispatch(peopleDelete(adapter, person));
    },
    [dispatch]
  );
}

export function useIsPersonUpdating(info: PersonInfo): boolean {
  const id = useMemo(() => createPersonInfoStateIdFromPersonInfo(info), [info]);

  const deleting = useSelector<RootState, boolean>(state => {
    return state.people.deletingIds.includes(id);
  });

  const updating = useSelector<RootState, boolean>(state => {
    return state.people.updatingIds.includes(id);
  });

  return deleting || updating;
}

export function usePersonDetailsData(
  adapter: ADAPTER_NAME,
  identifier: string
): PersonSchema | undefined {
  return useSelector<RootState, PersonSchema>(
    s =>
      s.people.data.byId[createPersonInfoStateId(adapter, identifier)]?.person
  );
}

export function usePersonDetailsRawData(
  adapter: ADAPTER_NAME,
  identifier: string
): GoogleContactsFeedEntry | BambooEmployee | GsuiteAdminUser | undefined {
  return useSelector<
    RootState,
    GoogleContactsFeedEntry | BambooEmployee | GsuiteAdminUser
  >(s => s.people.rawData[adapter].byId[identifier]);
}
