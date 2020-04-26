import { useSelector } from 'react-redux';

import { RootState } from '../../rootReducer';

export function useCreatingPerson(): boolean {
  return useSelector<RootState, boolean>(state => {
    return (
      state.people.creatingPerson.bamboo || state.people.creatingPerson.google
    );
  });
}
