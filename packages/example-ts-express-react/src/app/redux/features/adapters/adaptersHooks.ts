import { reduce } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../rootReducer';
import { AdapterName } from '../people';
import { AdaptersBooleanState } from './adaptersSlice';
import { loadAdaptersData } from './loadAdaptersData';

export function useInitAdaptersData(): void {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAdaptersData());
  }, [dispatch]);
}

export function useAdaptersLoading(): boolean {
  return useSelector<RootState, boolean>(state => {
    return state.adapters.loading;
  });
}

export function useAdaptersInitialized(): boolean {
  return useSelector<RootState, boolean>(state => {
    return state.adapters.initialized;
  });
}

export function useAdaptersError(): boolean {
  return useSelector<RootState, boolean>(state => {
    return state.adapters.error;
  });
}

export function useAdapterConfigured(
  adapterName: 'google' | 'bamboo'
): boolean {
  return useSelector<RootState, boolean>(state => {
    return state.adapters.configured[adapterName];
  });
}

export function useConfiguredAdapterNames(): AdapterName[] {
  const configured = useSelector<RootState, AdaptersBooleanState>(state => {
    return state.adapters.configured;
  });

  return reduce(
    configured,
    (result: AdapterName[], val: boolean, key: string) => {
      if (val) result.push(key as keyof AdaptersBooleanState);
      return result;
    },
    []
  );
}
