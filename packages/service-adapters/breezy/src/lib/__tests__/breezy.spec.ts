import axiosMock from 'axios';

import {
  EasyBreadClient,
  InMemoryStateAdapter,
  type inferCommandOutput,
} from '@easybread/core';
import { mockAxios } from '@easybread/test-utils';

import {
  BREEZY_COMMAND_NAME,
  BreezyAdapter,
  BreezyAuthBasicSetCommand,
  BreezyAuthStrategy,
  type BreezyJobApplicantSearchCommand,
  type BreezyOrganizationSearchCommand,
} from '../..';

import {
  CANDIDATES_RESPONSE_MOCK,
  COMPANIES_SEARCH_RESPONSE_MOCK,
  EMAIL,
  PASSWORD,
  POSITIONS_SEARCH_RESPONSE_MOCK,
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

    // ------------------------------------

    describe(BREEZY_COMMAND_NAME.HR_JOB_APPLICANT_SEARCH, () => {
      function invokeApplicantSearch(): Promise<
        inferCommandOutput<BreezyJobApplicantSearchCommand>
      > {
        return client.invoke(BREEZY_COMMAND_NAME.HR_JOB_APPLICANT_SEARCH, {
          breadId: USER_ID,
          params: null,
          pagination: { type: 'DISABLED' },
        });
      }

      beforeEach(async () => {
        jest
          .mocked(axiosMock.request)
          // 1. list companies
          .mockImplementationOnce(() =>
            Promise.resolve({
              status: 200,
              data: COMPANIES_SEARCH_RESPONSE_MOCK,
            }),
          )
          // 2. list published positions for the company
          .mockImplementationOnce(() =>
            Promise.resolve({
              status: 200,
              data: POSITIONS_SEARCH_RESPONSE_MOCK,
            }),
          )
          // 3. list candidates for the position
          .mockImplementationOnce(() =>
            Promise.resolve({
              status: 200,
              data: CANDIDATES_RESPONSE_MOCK,
            }),
          );
      });

      it(`should call companies, positions and candidates apis`, async () => {
        await invokeApplicantSearch();

        expect(axiosMock.request).toHaveBeenNthCalledWith(1, {
          headers: { authorization: 'accessToken' },
          method: 'GET',
          url: 'https://api.breezy.hr/v3/companies',
        });

        expect(axiosMock.request).toHaveBeenNthCalledWith(2, {
          headers: { authorization: 'accessToken' },
          method: 'GET',
          url: 'https://api.breezy.hr/v3/company/90e727223953/positions',
          params: { state: 'published' },
        });

        expect(axiosMock.request).toHaveBeenNthCalledWith(3, {
          headers: { authorization: 'accessToken' },
          method: 'GET',
          url: 'https://api.breezy.hr/v3/company/90e727223953/position/position-one/candidates',
          params: { page: 1, page_size: 50, sort: 'created' },
        });
      });

      it(`should return raw payload`, async () => {
        const result = await invokeApplicantSearch();
        if (!result.success) throw new Error('No success');
        expect(result.rawPayload).toEqual(CANDIDATES_RESPONSE_MOCK);
      });

      it(`should return Person[] schema payload`, async () => {
        const result = await invokeApplicantSearch();
        if (!result.success) throw new Error('No success');
        expect(result.payload).toEqual([
          {
            '@type': 'Person',
            identifier: 'candidate-one',
            email: 'jane.doe@mail.com',
            name: 'Jane Doe',
            givenName: 'Jane',
            familyName: 'Doe',
            image: 'https://breezy.hr/photos/jane.png',
            workLocation: 'New York, NY',
            createdAt: '2025-03-30T01:00:00.000Z',
            updatedAt: '2025-04-02T01:00:00.000Z',
            telephone: '+15551234567',
          },
        ]);
      });

      it(`should return DISABLED pagination`, async () => {
        const result = await invokeApplicantSearch();
        if (!result.success) throw new Error('No success');
        expect(result.pagination).toEqual({ type: 'DISABLED' });
      });
    });
  });
});