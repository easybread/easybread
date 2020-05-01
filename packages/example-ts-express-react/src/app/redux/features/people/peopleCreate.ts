import { PersonSchema } from '@easybread/schemas';

import { PeopleCreateResponseDto } from '../../../../dtos';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { AdapterName } from './peopleCommon';
import { peopleActions } from './peopleSlice';

export const peopleCreate = (
  adapter: AdapterName,
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
