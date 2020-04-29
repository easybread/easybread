import { isString } from 'lodash';
import { Person } from 'schema-dts';

import { PeopleCreateResponseDto } from '../../../../dtos';
import { putRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { AdapterName } from './peopleCommon';
import { peopleActions } from './peopleSlice';

export const peopleUpdate = (
  adapter: AdapterName,
  data: Person
): AppThunk => async dispatch => {
  if (isString(data)) throw new Error(`can't update: person is string`);

  if (!isString(data.identifier)) {
    throw new Error(`can't update: identifier is empty`);
  }

  const { identifier } = data;

  dispatch(peopleActions.peopleUpdateStart({ adapter, identifier }));

  try {
    const result = await putRequest<Person, PeopleCreateResponseDto>(
      `/api/people/${adapter}/${data.identifier}`,
      data
    );

    dispatch(notifyOperationResult(result));

    if (result.rawPayload.success) {
      dispatch(
        peopleActions.peopleUpdateSuccess({
          data: {
            person: result.payload,
            provider: adapter
          },
          adapter
        })
      );
    } else {
      dispatch(peopleActions.peopleUpdateFail({ adapter, identifier }));
    }
  } catch (e) {
    dispatch(peopleActions.peopleUpdateFail({ adapter, identifier }));
  }
};
