import { PeopleResponseDto } from '../../../../dtos';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { peopleActions, PersonInfo } from './peopleSlice';

export const peopleLoad = (
  adapter: 'google' | 'bamboo'
): AppThunk => async dispatch => {
  dispatch(peopleActions.peopleLoadingStart(adapter));

  const results = await getRequest<PeopleResponseDto>(`/api/people/${adapter}`);

  dispatch(notifyOperationResult(results));

  if (results.rawPayload.success) {
    const personInfos: PersonInfo[] = results.payload.map(person => ({
      provider: adapter,
      person
    }));

    dispatch(
      peopleActions.peopleLoadingSuccess({
        adapter,
        data: personInfos
      })
    );
  } else {
    dispatch(peopleActions.peopleLoadingError(adapter));
  }
};
