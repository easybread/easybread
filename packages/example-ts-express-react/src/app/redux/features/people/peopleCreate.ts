import { PersonSchema } from '@easybread/schemas';

import { PeopleCreateResponseDto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { peopleActions } from './peopleSlice';

export const peopleCreate = (
  adapter: ADAPTER_NAME,
  data: PersonSchema
): AppThunk => async dispatch => {
  dispatch(peopleActions.peopleCreateStart(adapter));

  const result = await postRequest<PersonSchema, PeopleCreateResponseDto>(
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
