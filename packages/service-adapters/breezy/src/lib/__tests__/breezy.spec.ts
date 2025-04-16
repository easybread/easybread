import {
  EasyBreadClient,
  InMemoryStateAdapter,
  type inferCommandOutput,
} from '@easybread/core';
import { mockAxios } from '@easybread/test-utils';
import axiosMock from 'axios';

import {
  BREEZY_COMMAND_NAME,
  BreezyAdapter,
  BreezyAuthBasicSetCommand,
  BreezyAuthStrategy,
  type BreezyOrganizationSearchCommand,
} from '../..';

import {
  COMPANIES_SEARCH_RESPONSE_MOCK,
  EMAIL,
  PASSWORD,
  SIGN_IN_RESPONSE_MOCK,
  USER_ID,
} from './mocks';

mockAxios();

describe('Breezy', () => {
  const stateAdapter = new InMemoryStateAdapter();
  const authStrategy = new BreezyAuthStrategy(stateAdapter);
  const breezyAdapter = new BreezyAdapter(authStrategy);

  const client = new EasyBreadClient(stateAdapter, breezyAdapter);

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await stateAdapter.reset();
    jest.restoreAllMocks();
  });

  // TODO: refactor: move operation tests in separate spec files & etc
  describe('operations', () => {
    describe('BREEZY_COMMAND_NAME.AUTH_BASIC_SET', () => {
      function invokeAuthenticate(): Promise<
        inferCommandOutput<BreezyAuthBasicSetCommand>
      > {
        return client.invoke(BREEZY_COMMAND_NAME.AUTH_BASIC_SET, {
          breadId: USER_ID,
          params: null,
          payload: {
            '@context': 'https://schema.easybread.io/auth',
            '@type': 'CredentialBasic',
            username: EMAIL,
            password: PASSWORD,
          },
        });
      }

      beforeEach(() => {
        jest.mocked(axiosMock.request).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: SIGN_IN_RESPONSE_MOCK,
          }),
        );
      });

      it(`should call the signin api`, async () => {
        await invokeAuthenticate();
        expect(axiosMock.request).toHaveBeenCalledWith({
          data: { email: EMAIL, password: PASSWORD },
          method: 'POST',
          url: 'https://api.breezy.hr/v3/signin',
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
          breadId: USER_ID,
          success: true,
          payload: {
            '@type': 'Person',
            createdAt: '2025-03-30T01:00:00.000Z',
            email: 'test@mail.com',
            emailVerified: true,
            givenName: 'Test',
            identifier: '123',
            name: 'Test',
            updatedAt: '2025-04-02T01:00:00.000Z',
          },
          rawPayload: SIGN_IN_RESPONSE_MOCK,
        });
      });
    });

    // ------------------------------------

    describe(BREEZY_COMMAND_NAME.HR_ORGANIZATION_SEARCH, () => {
      function invokeCompanySearch(): Promise<
        inferCommandOutput<BreezyOrganizationSearchCommand>
      > {
        return client.invoke(BREEZY_COMMAND_NAME.HR_ORGANIZATION_SEARCH, {
          breadId: USER_ID,
          params: null,
          pagination: { type: 'DISABLED' },
        });
      }

      beforeEach(async () => {
        jest.mocked(axiosMock.request).mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: COMPANIES_SEARCH_RESPONSE_MOCK,
          }),
        );
      });

      it(`should call companies api`, async () => {
        await invokeCompanySearch();
        expect(axiosMock.request).toHaveBeenCalledWith({
          headers: { authorization: 'accessToken' },
          method: 'GET',
          url: 'https://api.breezy.hr/v3/companies',
        });
      });

      it(`should return raw payload`, async () => {
        const result = await invokeCompanySearch();

        if (!result.success) throw new Error('No success');

        expect(result.rawPayload).toEqual(COMPANIES_SEARCH_RESPONSE_MOCK);
      });

      it(`should return schema payload`, async () => {
        const result = await invokeCompanySearch();
        if (!result.success) throw new Error('No success');
        expect(result.payload).toEqual([
          {
            '@type': 'Organization',
            alternateName: 'MI',
            identifier: '90e727223953',
            name: 'Medical Informatics Engineering',
            numberOfEmployees: 2,
          },
        ]);
      });
    });
  });
});
