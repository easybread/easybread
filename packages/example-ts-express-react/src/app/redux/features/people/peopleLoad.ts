import { PeopleResponseDto } from '../../../../dtos';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { AdapterName, PersonInfo } from './peopleCommon';
import { peopleActions } from './peopleSlice';

export const peopleLoad = (
  adapter: AdapterName
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
