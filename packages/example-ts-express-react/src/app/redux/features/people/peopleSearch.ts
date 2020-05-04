import { PeopleSearchResponseDto } from '../../../../api/api.dtos';
import { ProviderName, providerNameToAdapterName } from '../../../../common';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError, notifyOperationResult } from '../notifications';
import { PersonInfo } from './peopleCommon';
import { peopleActions } from './peopleSlice';

export const peopleSearch = (query: string): AppThunk => async dispatch => {
  dispatch(peopleActions.searchStart({ query }));

  try {
    const results = await getRequest<PeopleSearchResponseDto>(
      `/api/people/search`,
      { query }
    );

    const data = results.reduce<PersonInfo[]>(
      (accumulator, operationOutput) => {
        dispatch(notifyOperationResult(operationOutput));

        if (operationOutput.rawPayload.success) {
          operationOutput.payload.forEach(person => {
            accumulator.push({
              adapter: providerNameToAdapterName(
                operationOutput.provider as ProviderName
              ),
              person
            });
          });
        }

        return accumulator;
      },
      []
    );

    dispatch(peopleActions.searchComplete({ data, query }));
  } catch (e) {
    dispatch(notifyError('search failed', e.toString()));
    dispatch(peopleActions.searchStop({ query }));
  }
};
