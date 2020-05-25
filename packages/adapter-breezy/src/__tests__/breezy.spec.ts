import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import axiosMock from 'axios';

import {
  BreezyAdapter,
  BreezyAuthenticateOperation,
  BreezyAuthStrategy,
  BreezyCompanySearchOperation,
  BreezyOperationName
} from '..';
import {
  COMPANIES_SEARCH_RESPONSE_MOCK,
  EMAIL,
  PASSWORD,
  SIGN_IN_RESPONSE_MOCK,
  USER_ID
} from './mocks';
import Mock = jest.Mock;

jest.mock('axios');

describe('Breezy', () => {
  const breezyAdapter = new BreezyAdapter();
  const stateAdapter = new InMemoryStateAdapter();
  const authStrategy = new BreezyAuthStrategy(stateAdapter);

  const client = new EasyBreadClient(stateAdapter, breezyAdapter, authStrategy);

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await stateAdapter.reset();
    jest.restoreAllMocks();
  });

  // TODO: refactor: move operation tests in separate spec files & etc
  describe('operations', () => {
    describe(BreezyOperationName.AUTHENTICATE, () => {
      function invokeAuthenticate(): Promise<
        BreezyAuthenticateOperation['output']
      > {
        return client.invoke<BreezyAuthenticateOperation>({
          breadId: USER_ID,
          name: BreezyOperationName.AUTHENTICATE,
          payload: { email: EMAIL, password: PASSWORD }
        });
      }

      beforeEach(() => {
        (axiosMock.request as Mock).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: SIGN_IN_RESPONSE_MOCK
          })
        );
      });

      it(`should call the signin api`, async () => {
        await invokeAuthenticate();
        expect(axiosMock.request).toHaveBeenCalledWith({
          data: { email: EMAIL, password: PASSWORD },
          method: 'POST',
          url: 'https://api.breezy.hr/v3/signin'
        });
      });

      it(`should store the access token`, async () => {
        await invokeAuthenticate();
        const authData = await authStrategy.readAuthData(USER_ID);

        expect(authData).toEqual({ accessToken: 'accessToken' });
      });

      it(`should return the raw data`, async () => {
        const result = await invokeAuthenticate();

        expect(result).toEqual({
          provider: breezyAdapter.provider,
          name: BreezyOperationName.AUTHENTICATE,
          rawPayload: {
            data: SIGN_IN_RESPONSE_MOCK,
            success: true
          }
        });
      });
    });

    // ------------------------------------

    describe(BreezyOperationName.COMPANY_SEARCH, () => {
      function invokeCompanySearch(): Promise<
        BreezyCompanySearchOperation['output']
      > {
        return client.invoke<BreezyCompanySearchOperation>({
          breadId: USER_ID,
          name: BreezyOperationName.COMPANY_SEARCH,
          pagination: null
        });
      }

      beforeEach(async () => {
        (axiosMock.request as Mock).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: COMPANIES_SEARCH_RESPONSE_MOCK
          })
        );
      });

      it(`should call companies api`, async () => {
        await invokeCompanySearch();
        expect(axiosMock.request).toHaveBeenCalledWith({
          headers: { authorization: 'Bearer accessToken' },
          method: 'GET',
          url: 'https://api.breezy.hr/v3/companies'
        });
      });

      it(`should return raw payload`, async () => {
        const result = await invokeCompanySearch();
        expect(result.rawPayload).toEqual({
          success: true,
          data: COMPANIES_SEARCH_RESPONSE_MOCK
        });
      });

      it(`should return schema payload`, async () => {
        const result = await invokeCompanySearch();
        expect(result.payload).toEqual([
          {
            '@type': 'Organization',
            alternateName: 'MI',
            identifier: '90e727223953',
            name: 'Medical Informatics Engineering',
            numberOfEmployees: 2
          }
        ]);
      });
    });
  });
});
