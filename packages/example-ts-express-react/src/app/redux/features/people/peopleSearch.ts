import {
  BAMBOO_HR_PROVIDER_NAME,
  BambooEmployee,
  BambooEmployeesDirectory
} from '@easybread/adapter-bamboo-hr';
import {
  GOOGLE_PROVIDER_NAME,
  GoogleContactsFeedEntry,
  GoogleContactsPeopleSearchOperation
} from '@easybread/adapter-google-contacts';
import { EmployeeSearchOperation } from '@easybread/operations';

import { PeopleSearchResponseDto } from '../../../../api/api.dtos';
import {
  ADAPTER_NAME,
  ProviderName,
  providerNameToAdapterName
} from '../../../../common';
import { getRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyError, notifyOperationResult } from '../notifications';
import { peopleActions, PeopleSearchSuccessPayload } from './peopleSlice';

export const peopleSearch = (query: string): AppThunk => async dispatch => {
  dispatch(peopleActions.searchStart({ query }));

  try {
    const responseDto = await getRequest<PeopleSearchResponseDto>(
      `/api/people/search`,
      { query }
    );

    const data: PeopleSearchSuccessPayload['data'] = [];

    responseDto.forEach(operationOutput => {
      dispatch(notifyOperationResult(operationOutput));

      if (operationOutput.rawPayload.success) {
        operationOutput.payload.forEach(person => {
          data.push({
            adapter: providerNameToAdapterName(
              operationOutput.provider as ProviderName
            ),
            person
          });
        });
      }
    });

    dispatch(
      peopleActions.searchComplete({
        data,
        query,
        rawData: {
          [ADAPTER_NAME.BAMBOO]: collectBambooRawData(responseDto),
          [ADAPTER_NAME.GOOGLE]: collectGoogleRawData(responseDto)
        }
      })
    );
  } catch (e) {
    dispatch(notifyError('search failed', e.toString()));
    dispatch(peopleActions.searchStop({ query }));
  }
};

// Raw response data is just the raw 3rd party api response as is
// and it is not supposed to be standardized.
//
// If you really want to work with it, it means that you aware of
// its structure for every operation output
// and the proper handling of it is completely your responsibility.
// As well as fixing your code if the breaking change is released
// in the corresponding package.
//
// Below 2 functions are doing exactly that
// ------------------------------------

function collectGoogleRawData(
  data: PeopleSearchResponseDto
): GoogleContactsFeedEntry[] | undefined {
  const googleOutput = data.find(
    item => item.provider === GOOGLE_PROVIDER_NAME
  ) as GoogleContactsPeopleSearchOperation['output'] | undefined;

  return googleOutput && googleOutput.rawPayload.success
    ? googleOutput.rawPayload.data.feed.entry
    : undefined;
}

function collectBambooRawData(
  responseDto: PeopleSearchResponseDto
): BambooEmployee[] | undefined {
  const bambooOutput = responseDto.find(
    item => item.provider === BAMBOO_HR_PROVIDER_NAME
  ) as EmployeeSearchOperation<BambooEmployeesDirectory>['output'] | undefined;

  return bambooOutput && bambooOutput.rawPayload.success
    ? bambooOutput.rawPayload.data.employees
    : undefined;
}
