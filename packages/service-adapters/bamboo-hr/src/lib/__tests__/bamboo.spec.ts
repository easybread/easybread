import {
  type BreadOperationOutputPagination,
  EasyBreadClient,
  InMemoryStateAdapter,
} from '@easybread/core';
import type { ApplyActionSchema } from '@easybread/schemas';
import {
  BreadOperationName,
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  SetupBasicAuthOperation,
} from '@easybread/operations';
import {
  createAxiosError,
  mockAxios,
  setExtendedTimeout,
} from '@easybread/test-utils';

import axios, { AxiosResponse } from 'axios';
import {
  type BambooApplicationList,
  type BambooBasicAuthPayload,
  type BambooEmployee,
  type BambooEmployeesDirectory,
  type BambooHrJobApplicationSearchOperation,
  type BambooHrJobApplicantSearchOperation,
  BambooHrAdapter,
  BambooHrAuthStrategy,
  BambooHrOperationName,
} from '../..';
import { BAMBOO_EMPLOYEE_MOCK } from './bamboo.employee.mock';
import { BAMBOO_EMPLOYEES_DIR_MOCK } from './bamboo.employees-dir.mock';
import { BAMBOO_APPLICATIONS_MOCK } from './bamboo.applications.mock';

mockAxios();
setExtendedTimeout();

const API_KEY = 'user-secret-key';
const BREAD_ID = 'user-one';
const COMPANY_NAME = 'company-one';

describe('usage', () => {
  // create adapters
  const bambooHrAdapter = new BambooHrAdapter();
  const stateAdapter = new InMemoryStateAdapter();
  const authStrategy = new BambooHrAuthStrategy(stateAdapter);

  const client = new EasyBreadClient(
    stateAdapter,
    bambooHrAdapter,
    authStrategy
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await stateAdapter.reset();
    jest.restoreAllMocks();
  });

  describe(`${BreadOperationName.SETUP_BASIC_AUTH}`, () => {
    it(`should store auth data`, async () => {
      const authResult = await client.invoke<
        SetupBasicAuthOperation<BambooBasicAuthPayload>
      >({
        breadId: BREAD_ID,
        name: BreadOperationName.SETUP_BASIC_AUTH,
        payload: { apiKey: API_KEY, companyName: COMPANY_NAME },
      });

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

  describe(`${BreadOperationName.EMPLOYEE_SEARCH}`, () => {
    beforeEach(async () => {
      jest.mocked(axios.request).mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: BAMBOO_EMPLOYEES_DIR_MOCK,
        })
      );
    });

    function invokeEmployeeSearch(
      query?: string
    ): Promise<EmployeeSearchOperation<BambooEmployeesDirectory>['output']> {
      return client.invoke<EmployeeSearchOperation<BambooEmployeesDirectory>>({
        breadId: BREAD_ID,
        name: BreadOperationName.EMPLOYEE_SEARCH,
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
        } as AxiosResponse)
      );
    });

    function invokeEmployeeById(): Promise<
      EmployeeByIdOperation<BambooEmployee>['output']
    > {
      return client.invoke<EmployeeByIdOperation<BambooEmployee>>({
        name: BreadOperationName.EMPLOYEE_BY_ID,
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
        } as unknown as AxiosResponse)
      );
    });

    function invokeEmployeeCreate(): Promise<
      EmployeeCreateOperation['output']
    > {
      return client.invoke<EmployeeCreateOperation>({
        name: BreadOperationName.EMPLOYEE_CREATE,
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
        (a) => a.appliedDate >= `2024-10-11 00:00:00`
      );

      jest.mocked(axios.request).mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            applications: applicationsFilteredByStartTime,
            nextPageUrl: null,
            paginationComplete: true,
          } satisfies BambooApplicationList,
        })
      );

      const result = await client.invoke<BambooHrJobApplicationSearchOperation>(
        {
          name: BreadOperationName.JOB_APPLICATION_SEARCH,
          breadId: BREAD_ID,
          pagination: { type: 'PREV_NEXT', page: 1 },
          params: { startTime },
        }
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
        })
      );

      const result = await client.invoke<BambooHrJobApplicationSearchOperation>(
        {
          name: BreadOperationName.JOB_APPLICATION_SEARCH,
          breadId: BREAD_ID,
          pagination: { type: 'PREV_NEXT', page: 1 },
          params: {},
        }
      );

      expect(result.pagination).toEqual({
        type: 'PREV_NEXT',
        next: 2,
      } satisfies BreadOperationOutputPagination<'PREV_NEXT'>);

      const nextPageResult =
        await client.invoke<BambooHrJobApplicationSearchOperation>({
          name: BreadOperationName.JOB_APPLICATION_SEARCH,
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
          params: expect.objectContaining({
            page: 2,
          }),
        })
      );
    });
  });

  describe(`${BambooHrOperationName.JOB_APPLICANT_SEARCH}`, () => {
    it(`should return an expected rawData and payload`, async () => {
      const startTime = new Date('2024-10-11T00:00:00.000Z').toISOString();
      const applicationsFilteredByStartTime = BAMBOO_APPLICATIONS_MOCK.filter(
        (a) => a.appliedDate >= `2024-10-11 00:00:00`
      );

      jest.mocked(axios.request).mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            applications: applicationsFilteredByStartTime,
            nextPageUrl: null,
            paginationComplete: true,
          } satisfies BambooApplicationList,
        })
      );

      const result = await client.invoke<BambooHrJobApplicantSearchOperation>({
        name: BreadOperationName.JOB_APPLICANT_SEARCH,
        breadId: BREAD_ID,
        pagination: { type: 'PREV_NEXT', page: 1 },
        params: { startTime },
      });

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
});
