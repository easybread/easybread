import { Person } from 'schema-dts';

import { PeopleCreateResponseDto } from '../../../../dtos';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { peopleActions } from './peopleSlice';
import { notifyOperationResult } from '../notifications';

export const peopleCreate = (
  adapter: 'google' | 'bamboo',
  data: Person
): AppThunk => async dispatch => {
  dispatch(peopleActions.peopleCreateStart(adapter));

  const result = await postRequest<Person, PeopleCreateResponseDto>(
    `/api/people/${adapter}`,
    data
  );

  dispatch(notifyOperationResult(result));

  if (result.rawPayload.success) {
    dispatch(
      peopleActions.peopleCreateSuccess({
        data: {
          person: result.payload,
          provider: adapter
        },
        adapter
      })
    );
  } else {
    dispatch(peopleActions.peopleCreateFail(adapter));
  }
};
