import {
  type BreadOperationOutputPagination,
  EasyBreadClient,
  InMemoryStateAdapter,
} from '@easybread/core';
import {
  BreadOperationName,
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
} from '@easybread/operations';
import type { ApplyActionSchema } from '@easybread/schemas';
import {
  createAxiosError,
  expectFormDataValues,
  getNthMockCallArgs,
  getNthMockCallMthArg,
  mockAxios,
  setExtendedTimeout,
} from '@easybread/test-utils';
import axios, { AxiosResponse } from 'axios';

import {
  BAMBOO_HR_PROVIDER_NAME,
  type BambooApplicationList,
  type BambooEmployee,
  type BambooEmployeesDirectory,
  BambooHrAdapter,
  BambooHrAuthStrategy,
  BambooHrOperationName,
  type BambooOidcConnectionAttemptStateData,
  type BambooOidcLoginPayload,
  type BambooOidcTokenPayload,
} from '../..';

import { BAMBOO_APPLICATIONS_MOCK } from './bamboo.applications.mock';
import { BAMBOO_EMPLOYEE_MOCK } from './bamboo.employee.mock';
import { BAMBOO_EMPLOYEES_DIR_MOCK } from './bamboo.employees-dir.mock';

mockAxios();
setExtendedTimeout();

const API_KEY = 'user-secret-key';
const BREAD_ID = 'user-one';
const COMPANY_NAME = 'company-one';

const OIDC_CLIENT_ID = 'client-id';
const OIDC_CLIENT_SECRET = 'client-secret';
const OIDC_REDIRECT_URI = 'http://localhost:3000/accept-bamboo-oidc-code';
const OIDC_APPLICATION_KEY = 'application-key';

async function readAuthAttemptData(breadId: string = BREAD_ID) {
  return stateAdapter.read<BambooOidcConnectionAttemptStateData>(
    `${BAMBOO_HR_PROVIDER_NAME}:auth-attempt:BambooHrAuthStrategy:${breadId}`,
  );
}

// create adapters
const bambooHrAdapter = new BambooHrAdapter();
const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new BambooHrAuthStrategy(stateAdapter);

const client = new EasyBreadClient(stateAdapter, bambooHrAdapter, authStrategy);

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(async () => {
  await stateAdapter.reset();
  jest.restoreAllMocks();
});

describe(`${BreadOperationName.SETUP_BASIC_AUTH}`, () => {
  it(`should store auth data`, async () => {
    const authResult = await client.invoke(
      BreadOperationName.SETUP_BASIC_AUTH,
      {
        breadId: BREAD_ID,
        payload: {
          apiKey: API_KEY,
          companyName: COMPANY_NAME,
        },
      },
    );

    expect(authResult).toEqual({
      provider: bambooHrAdapter.provider,
      name: 'BREAD/SETUP_BASIC_AUTH',
      rawPayload: {
        success: true,
      },
    });

    const authData = await authStrategy.readAuthData(BREAD_ID);

    expect(authData).toEqual({
      companyName: 'company-one',
      token: 'dXNlci1zZWNyZXQta2V5Ong=',
    });
  });
});

describe(BambooHrOperationName.OIDC_AUTH_START, () => {
  it('should throw if no oidc config wes provided to the ', async () => {
    const result = await client.invoke(BambooHrOperationName.OIDC_AUTH_START, {
      breadId: BREAD_ID,
      payload: { companyName: COMPANY_NAME },
    });

    expect(result).toEqual({
      name: BambooHrOperationName.OIDC_AUTH_START,
      provider: BAMBOO_HR_PROVIDER_NAME,
      rawPayload: {
        success: false,
        error: {
          name: 'ServiceException',
          provider: BAMBOO_HR_PROVIDER_NAME,
          message:
            'bamboo: BambooHrAuthStrategy is not configured to support OpenID Connect',
          originalError: {
            message:
              'BambooHrAuthStrategy is not configured to support OpenID Connect',
            name: 'BreadException',
          },
        },
      },
    });
  });

  it(`should return the redirect url`, async () => {
    authStrategy.configureOidc({
      clientId: OIDC_CLIENT_ID,
      applicationKey: OIDC_APPLICATION_KEY,
      clientSecret: OIDC_CLIENT_SECRET,
      redirectUri: OIDC_REDIRECT_URI,
    });

    const result = await client.invoke(BambooHrOperationName.OIDC_AUTH_START, {
      breadId: BREAD_ID,
      payload: { companyName: COMPANY_NAME },
    });

    expect(result).toEqual({
      name: 'BAMBOO_HR/OIDC_AUTH/START',
      provider: 'bamboo',
      rawPayload: {
        data: {
          authUri: expect.stringMatching(
            /^https:\/\/company-one\.bamboohr\.com\/authorize\.php\?request=authorize&response_type=code&scope=openid\+email&state=[^&]+&client_id=client-id&redirect_uri=http:\/\/localhost:3000\/accept-bamboo-oidc-code$/,
          ),
        },
        success: true,
      },
    });
  });

  it(`should store the connection attempt`, async () => {
    await client.invoke(BambooHrOperationName.OIDC_AUTH_START, {
      breadId: BREAD_ID,
      payload: { companyName: COMPANY_NAME },
    });

    await expect(readAuthAttemptData()).resolves.toEqual({
      breadId: BREAD_ID,
      companyName: COMPANY_NAME,
      authAttemptToken: expect.any(String),
    });
  });
});

describe(`${BambooHrOperationName.OIDC_AUTH_COMPLETE}`, () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    jest
      .mocked(axios.request)
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            access_token: 'ACCESS_TOKEN',
            token_type: 'Bearer',
            expires_in: 3600,
            scope: 'openid+email',
            company_domain: COMPANY_NAME,
            id_token: 'ID_TOKEN',
          } satisfies BambooOidcTokenPayload,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            key: API_KEY,
            success: true,
            apiUrl: 'https://api.bamboohr.com/api/gateway.php',
            userId: 'BAMBOO_USER_ID',
            employeeId: 'BAMBOO_EMPLOYEE_ID',
          } satisfies BambooOidcLoginPayload,
        }),
      );
  });

  async function callOidcComplete() {
    await client.invoke(BambooHrOperationName.OIDC_AUTH_START, {
      breadId: BREAD_ID,
      payload: { companyName: COMPANY_NAME },
    });

    const attemptData = await readAuthAttemptData();

    if (!attemptData) throw new Error('No connection attempt found');

    return client.invoke(BambooHrOperationName.OIDC_AUTH_COMPLETE, {
      breadId: BREAD_ID,
      payload: {
        code: 'some-code',
        state: attemptData.authAttemptToken,
      },
    });
  }

  it(`should throw if the state is invalid`, async () => {
    await client.invoke(BambooHrOperationName.OIDC_AUTH_START, {
      breadId: BREAD_ID,
      payload: { companyName: COMPANY_NAME },
    });

    const result = await client.invoke(
      BambooHrOperationName.OIDC_AUTH_COMPLETE,
      {
        breadId: BREAD_ID,
        payload: {
          code: 'some-code',
          state: 'wrong-state',
        },
      },
    );

    expect(result).toEqual({
      name: BambooHrOperationName.OIDC_AUTH_COMPLETE,
      provider: BAMBOO_HR_PROVIDER_NAME,
      rawPayload: {
        error: {
          message: 'bamboo: Auth attempt token mismatch for user-one',
          name: 'ServiceException',
          originalError: {
            message: 'Auth attempt token mismatch for user-one',
            name: 'AuthAttemptTokenMismatchException',
          },
          provider: BAMBOO_HR_PROVIDER_NAME,
        },
        success: false,
      },
    });
  });

  it(`should return successful result`, async () => {
    const result = await callOidcComplete();

    expect(result).toEqual({
      name: BambooHrOperationName.OIDC_AUTH_COMPLETE,
      provider: bambooHrAdapter.provider,
      rawPayload: {
        success: true,
        data: { companyName: COMPANY_NAME },
      },
    });
  });

  it(`should save the received api key as auth data`, async () => {
    const authData = await authStrategy.readAuthData(BREAD_ID);

    expect(authData).toEqual({
      companyName: 'company-one',
      token: 'dXNlci1zZWNyZXQta2V5Ong=',
    });
  });

  it(`should call the token endpoint`, async () => {
    await callOidcComplete();
    expect(getNthMockCallArgs(axios.request, 1)).toEqual([
      {
        url: 'https://company-one.bamboohr.com/token.php?request=token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
        data: expect.any(FormData),
      },
    ]);

    expectFormDataValues(
      getNthMockCallMthArg<{ data: FormData }>(axios.request, 1, 1).data,
      {
        client_id: 'client-id',
        client_secret: 'client-secret',
        code: 'some-code',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/accept-bamboo-oidc-code',
        scope: 'openid email',
      },
    );
  });

  it(`should call the login endpoint`, async () => {
    await callOidcComplete();
    expect(getNthMockCallArgs(axios.request, 2)).toEqual([
      {
        url: 'https://api.bamboohr.com/api/gateway.php/company-one/v1/oidcLogin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
        data: expect.any(FormData),
      },
    ]);

    expectFormDataValues(
      getNthMockCallMthArg<{ data: FormData }>(axios.request, 2, 1).data,
      {
        applicationKey: 'application-key',
        id_token: 'ID_TOKEN',
      },
    );
  });
});

describe(`${BreadOperationName.EMPLOYEE_SEARCH}`, () => {
  beforeEach(async () => {
    jest.mocked(axios.request).mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: BAMBOO_EMPLOYEES_DIR_MOCK,
      }),
    );
  });

  function invokeEmployeeSearch(
    query?: string,
  ): Promise<EmployeeSearchOperation<BambooEmployeesDirectory>['output']> {
    return client.invoke(BreadOperationName.EMPLOYEE_SEARCH, {
      breadId: BREAD_ID,
      params: { query },
      pagination: { type: 'DISABLED' },
    });
  }

  it(`should call bamboo https://api.bamboohr.com/api/gateway.php/${COMPANY_NAME}/v1/employees/directory api`, async () => {
    await invokeEmployeeSearch();

    expect(axios.request).toHaveBeenCalledWith({
      url: `https://api.bamboohr.com/api/gateway.php/${COMPANY_NAME}/v1/employees/directory`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: expect.stringMatching(/Basic .+/),
      },
    });
  });

  it(`should have correct output`, async () => {
    const employees = await invokeEmployeeSearch();
    expect(employees).toEqual({
      name: 'BREAD/EMPLOYEE/SEARCH',
      pagination: { type: 'DISABLED' },
      payload: [
        {
          '@type': 'Person',
          email: '2110pro@mail.ru',
          familyName: 'Employee',
          gender: 'Male',
          givenName: 'Test',
          identifier: '112',
          image:
            'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
          jobTitle: 'JavaScript Developer',
          name: 'Test Employee',
          telephone: '+71231231212',
          workLocation: 'Remote',
        },
        {
          '@type': 'Person',
          email: 'test2@mail.ru',
          familyName: 'Employee2',
          gender: 'Male',
          givenName: 'Test',
          identifier: '113',
          image:
            'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
          jobTitle: 'JavaScript Developer',
          name: 'Test Employee2',
          telephone: '+71231231213',
          workLocation: 'Remote',
        },
      ],
      provider: 'bamboo',
      rawPayload: {
        data: BAMBOO_EMPLOYEES_DIR_MOCK,
        success: true,
      },
    });
  });

  it(`should support search query`, async () => {
    const employees = await invokeEmployeeSearch('employee2');
    expect(employees).toEqual({
      name: 'BREAD/EMPLOYEE/SEARCH',
      pagination: { type: 'DISABLED' },
      payload: [
        {
          '@type': 'Person',
          email: 'test2@mail.ru',
          familyName: 'Employee2',
          gender: 'Male',
          givenName: 'Test',
          identifier: '113',
          image:
            'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
          jobTitle: 'JavaScript Developer',
          name: 'Test Employee2',
          telephone: '+71231231213',
          workLocation: 'Remote',
        },
      ],
      provider: 'bamboo',
      rawPayload: {
        // raw payload contains more results. that is expected
        // because the BambooHR API doesn't support searching.
        data: BAMBOO_EMPLOYEES_DIR_MOCK,
        success: true,
      },
    });
  });
});

// ------------------------------------

describe(`${BreadOperationName.EMPLOYEE_BY_ID}`, () => {
  beforeEach(async () => {
    (axios.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: BAMBOO_EMPLOYEE_MOCK,
      } as AxiosResponse),
    );
  });

  function invokeEmployeeById(): Promise<
    EmployeeByIdOperation<BambooEmployee>['output']
  > {
    return client.invoke(BreadOperationName.EMPLOYEE_BY_ID, {
      breadId: BREAD_ID,
      params: { identifier: '112' },
    });
  }

  it(`should call bamboo api with correct params`, async () => {
    await invokeEmployeeById();
    expect(axios.request).toHaveBeenCalledWith({
      headers: {
        accept: 'application/json',
        authorization: 'Basic dXNlci1zZWNyZXQta2V5Ong=',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      params: {
        fields: [
          'canUploadPhoto',
          'department',
          'displayName',
          'division',
          'firstName',
          'gender',
          'jobTitle',
          'lastName',
          'linkedIn',
          'location',
          'mobilePhone',
          'photoUploaded',
          'photoUrl',
          'preferredName',
          'workEmail',
          'workPhone',
          'workPhoneExtension',
          'skypeUsername',
        ].join(','),
      },
      url: 'https://api.bamboohr.com/api/gateway.php/company-one/v1/employees/112',
    });
  });

  it(`should return correct output`, async () => {
    const result = await invokeEmployeeById();
    expect(result).toEqual({
      name: 'BREAD/EMPLOYEE/BY_ID',
      payload: {
        '@type': 'Person',
        email: '2110pro@mail.ru',
        familyName: 'Employee',
        gender: 'Male',
        givenName: 'Test',
        identifier: '112',
        image:
          'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
        jobTitle: 'JavaScript Developer',
        name: 'Test Employee',
        telephone: '+71231231212',
        workLocation: 'Remote',
      },
      provider: 'bamboo',
      rawPayload: { data: BAMBOO_EMPLOYEE_MOCK, success: true },
    });
  });
});

// ------------------------------------

describe(`${BreadOperationName.EMPLOYEE_CREATE}`, () => {
  beforeEach(async () => {
    (axios.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        status: 201,
        headers: {
          // this has a new id
          location:
            'https://api.bamboohr.com/api/gateway.php/mietest/v1/employees/27',
        },
        // TODO: remove as unknown and fix ts error
      } as unknown as AxiosResponse),
    );
  });

  function invokeEmployeeCreate(): Promise<EmployeeCreateOperation['output']> {
    return client.invoke(BreadOperationName.EMPLOYEE_CREATE, {
      breadId: BREAD_ID,
      payload: {
        '@type': 'Person',
        email: '2110pro@mail.ru',
        givenName: 'New',
        familyName: 'Employee',
        telephone: '+71231231212',
      },
    });
  }

  it(`should call bamboo API`, async () => {
    await invokeEmployeeCreate();
    expect(axios.request).toHaveBeenCalledWith({
      url: 'https://api.bamboohr.com/api/gateway.php/company-one/v1/employees',
      method: 'POST',
      data: {
        firstName: 'New',
        lastName: 'Employee',
        workEmail: '2110pro@mail.ru',
        workPhone: '+71231231212',
      },
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        authorization: 'Basic dXNlci1zZWNyZXQta2V5Ong=',
      },
    });
  });

  it(`should have correct output`, async () => {
    const result = await invokeEmployeeCreate();
    expect(result).toEqual({
      name: 'BREAD/EMPLOYEE/CREATE',
      payload: {
        '@type': 'Person',
        identifier: '27',
        email: '2110pro@mail.ru',
        familyName: 'Employee',
        givenName: 'New',
        telephone: '+71231231212',
      },
      provider: 'bamboo',
      rawPayload: {
        data: {},
        success: true,
      },
    });
  });

  it(`should return correct error when request failed with 409`, async () => {
    const error = createAxiosError('Request failed with status code 409', {
      status: 409,
      headers: {
        'x-bamboohr-error-messsage': 'Duplicate email, Duplicate email',
        'x-bamboohr-error-message': 'Duplicate email, Duplicate email',
      },
    });

    jest
      .mocked(axios.request)
      .mockReset()
      .mockImplementation(() => Promise.reject(error));

    const result = await invokeEmployeeCreate();

    // get what the res.json would send
    expect(result).toEqual({
      name: 'BREAD/EMPLOYEE/CREATE',
      provider: 'bamboo',
      rawPayload: {
        error: {
          name: 'ServiceException',
          message:
            'bamboo: Request failed with status code 409. Duplicate email',
          originalError: {
            code: 'TEST_CODE',
            config: {},
            message: 'Request failed with status code 409',
            name: 'AxiosError',
            stack: expect.any(String),
            status: 409,
          },
          provider: 'bamboo',
        },
        success: false,
      },
    });
  });
});

describe(`${BambooHrOperationName.JOB_APPLICATION_SEARCH}`, () => {
  it(`should return an expected rawData and payload`, async () => {
    const startTime = new Date('2024-10-11T00:00:00.000Z').toISOString();
    const applicationsFilteredByStartTime = BAMBOO_APPLICATIONS_MOCK.filter(
      a => a.appliedDate >= `2024-10-11 00:00:00`,
    );

    jest.mocked(axios.request).mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {
          applications: applicationsFilteredByStartTime,
          nextPageUrl: null,
          paginationComplete: true,
        } satisfies BambooApplicationList,
      }),
    );

    const result = await client.invoke(
      BreadOperationName.JOB_APPLICATION_SEARCH,
      {
        breadId: BREAD_ID,
        pagination: { type: 'PREV_NEXT', page: 1 },
        params: { startTime },
      },
    );

    expect(result.rawPayload).toEqual({
      data: {
        applications: applicationsFilteredByStartTime,
        nextPageUrl: null,
        paginationComplete: true,
      },
      success: true,
    });

    expect(result.pagination).toEqual({
      type: 'PREV_NEXT',
    });

    expect(result.payload).toEqual([
      {
        '@type': 'ApplyAction',
        agent: {
          '@type': 'Person',
          familyName: 'Lewis',
          givenName: 'Janet',
          identifier: '110',
          image:
            'https://resources.bamboohr.com/employees/photos/initials.php?initials=JL',
          name: 'Janet Lewis',
        },
        identifier: '48',
        object: {
          '@type': 'JobPosting',
          identifier: '19',
          title: 'General Application',
        },
        starTime: '2024-10-19T17:08:59+00:00',
      },
      {
        '@type': 'ApplyAction',
        agent: {
          '@type': 'Person',
          familyName: 'Garcia',
          givenName: 'James',
          identifier: '114',
          image:
            'https://resources.bamboohr.com/employees/photos/initials.php?initials=JG',
          name: 'James Garcia',
        },
        identifier: '56',
        object: {
          '@type': 'JobPosting',
          identifier: '21',
          title: 'Marketing Manager',
        },
        starTime: '2024-10-11T22:46:01+00:00',
      },
      {
        '@type': 'ApplyAction',
        agent: {
          '@type': 'Person',
          familyName: 'Stone',
          givenName: 'John',
          identifier: '109',
          image:
            'https://resources.bamboohr.com/employees/photos/initials.php?initials=JS',
          name: 'John Stone',
        },
        identifier: '47',
        object: {
          '@type': 'JobPosting',
          identifier: '19',
          title: 'General Application',
        },
        starTime: '2024-10-11T20:07:43+00:00',
      },
    ] satisfies ApplyActionSchema[]);
  });

  it(`should map pagination data correctly`, async () => {
    jest.mocked(axios.request).mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {
          applications: BAMBOO_APPLICATIONS_MOCK,
          nextPageUrl: `https://api.bamboohr.com/api/gateway.php/${COMPANY_NAME}/v1/applicant_tracking/applications?page=2`,
          paginationComplete: false,
        } satisfies BambooApplicationList,
      }),
    );

    const result = await client.invoke(
      BreadOperationName.JOB_APPLICATION_SEARCH,
      {
        breadId: BREAD_ID,
        pagination: { type: 'PREV_NEXT', page: 1 },
        params: {},
      },
    );

    expect(result.pagination).toEqual({
      type: 'PREV_NEXT',
      next: 2,
    } satisfies BreadOperationOutputPagination<'PREV_NEXT'>);

    await client.invoke(BreadOperationName.JOB_APPLICATION_SEARCH, {
      breadId: BREAD_ID,
      pagination: {
        type: 'PREV_NEXT',
        page: result.pagination.next,
      },
      params: {},
    });

    expect(jest.mocked(axios.request)).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        params: expect.objectContaining({ page: 2 }),
      }),
    );
  });
});

describe(`${BambooHrOperationName.JOB_APPLICANT_SEARCH}`, () => {
  it(`should return an expected rawData and payload`, async () => {
    const startTime = new Date('2024-10-11T00:00:00.000Z').toISOString();
    const applicationsFilteredByStartTime = BAMBOO_APPLICATIONS_MOCK.filter(
      a => a.appliedDate >= `2024-10-11 00:00:00`,
    );

    jest.mocked(axios.request).mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {
          applications: applicationsFilteredByStartTime,
          nextPageUrl: null,
          paginationComplete: true,
        } satisfies BambooApplicationList,
      }),
    );

    const result = await client.invoke(
      BreadOperationName.JOB_APPLICANT_SEARCH,
      {
        breadId: BREAD_ID,
        pagination: { type: 'PREV_NEXT', page: 1 },
        params: { startTime },
      },
    );

    expect(result.rawPayload).toEqual({
      data: {
        applications: applicationsFilteredByStartTime,
        nextPageUrl: null,
        paginationComplete: true,
      },
      success: true,
    });

    expect(result.payload).toEqual([
      {
        '@type': 'Person',
        familyName: 'Lewis',
        givenName: 'Janet',
        identifier: '110',
        image:
          'https://resources.bamboohr.com/employees/photos/initials.php?initials=JL',
        name: 'Janet Lewis',
      },
      {
        '@type': 'Person',
        familyName: 'Garcia',
        givenName: 'James',
        identifier: '114',
        image:
          'https://resources.bamboohr.com/employees/photos/initials.php?initials=JG',
        name: 'James Garcia',
      },
      {
        '@type': 'Person',
        familyName: 'Stone',
        givenName: 'John',
        identifier: '109',
        image:
          'https://resources.bamboohr.com/employees/photos/initials.php?initials=JS',
        name: 'John Stone',
      },
    ]);
  });
});
