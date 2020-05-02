import { PeopleResponseDto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { PersonInfo } from './peopleCommon';
import { peopleActions } from './peopleSlice';

export const peopleLoad = (
  adapter: ADAPTER_NAME
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
