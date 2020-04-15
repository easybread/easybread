import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../rootReducer';
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
