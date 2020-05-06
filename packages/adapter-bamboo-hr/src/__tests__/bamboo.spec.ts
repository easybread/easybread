import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  SetupBasicAuthOperation
} from '@easybread/operations';
import { mockAxios, setExtendedTimeout } from '@easybread/test-utils';
import axiosMock, { AxiosError, AxiosResponse } from 'axios';

import { BambooEmployee, BambooHrAuthStrategy } from '..';
import {
  BambooBasicAuthPayload,
  BambooEmployeesDirectory,
  BambooHrAdapter
} from '../';
import { BAMBOO_EMPLOYEE_MOCK } from './bamboo.employee.mock';
import { BAMBOO_EMPLOYEES_DIR_MOCK } from './bamboo.employees-dir.mock';

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
        payload: { apiKey: API_KEY, companyName: COMPANY_NAME }
      });

      expect(authResult).toEqual({
        provider: bambooHrAdapter.provider,
        name: 'BREAD/SETUP_BASIC_AUTH',
        rawPayload: {
          success: true
        }
      });

      const authData = await authStrategy.readAuthData(BREAD_ID);
      expect(authData).toEqual({
        companyName: 'company-one',
        token: 'dXNlci1zZWNyZXQta2V5Ong='
      });
    });
  });

  describe(`${BreadOperationName.EMPLOYEE_SEARCH}`, () => {
    beforeEach(async () => {
      (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: BAMBOO_EMPLOYEES_DIR_MOCK
        })
      );
    });

    function invokeEmployeeSearch(
      query?: string
    ): Promise<EmployeeSearchOperation<BambooEmployeesDirectory>['output']> {
      return client.invoke<EmployeeSearchOperation<BambooEmployeesDirectory>>({
        breadId: BREAD_ID,
        name: BreadOperationName.EMPLOYEE_SEARCH,
        params: { query }
      });
    }

    it(`should call bamboo https://api.bamboohr.com/api/gateway.php/${COMPANY_NAME}/v1/employees/directory api`, async () => {
      await invokeEmployeeSearch();

      expect(axiosMock.request).toHaveBeenCalledWith({
        url: `https://api.bamboohr.com/api/gateway.php/${COMPANY_NAME}/v1/employees/directory`,
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: expect.stringMatching(/Basic .+/)
        }
      });
    });

    it(`should have correct output`, async () => {
      const employees = await invokeEmployeeSearch();
      expect(employees).toEqual({
        name: 'BREAD/EMPLOYEE/SEARCH',
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
            workLocation: 'Remote'
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
            workLocation: 'Remote'
          }
        ],
        provider: 'bamboo',
        rawPayload: {
          data: BAMBOO_EMPLOYEES_DIR_MOCK,
          success: true
        }
      });
    });

    it(`should support search query`, async () => {
      const employees = await invokeEmployeeSearch('employee2');
      expect(employees).toEqual({
        name: 'BREAD/EMPLOYEE/SEARCH',
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
            workLocation: 'Remote'
          }
        ],
        provider: 'bamboo',
        rawPayload: {
          // raw payload contains more results. that is expected
          // because the BambooHR API doesn't support searching.
          data: BAMBOO_EMPLOYEES_DIR_MOCK,
          success: true
        }
      });
    });
  });

  // ------------------------------------

  describe(`${BreadOperationName.EMPLOYEE_BY_ID}`, () => {
    beforeEach(async () => {
      (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: BAMBOO_EMPLOYEE_MOCK
        } as AxiosResponse)
      );
    });

    function invokeEmployeeById(): Promise<
      EmployeeByIdOperation<BambooEmployee>['output']
    > {
      return client.invoke<EmployeeByIdOperation<BambooEmployee>>({
        name: BreadOperationName.EMPLOYEE_BY_ID,
        breadId: BREAD_ID,
        params: { identifier: '112' }
      });
    }

    it(`should call bamboo api with correct params`, async () => {
      await invokeEmployeeById();
      expect(axiosMock.request).toHaveBeenCalledWith({
        headers: {
          accept: 'application/json',
          authorization: 'Basic dXNlci1zZWNyZXQta2V5Ong=',
          'Content-Type': 'application/json'
        },
        method: 'GET',
        url:
          'https://api.bamboohr.com/api/gateway.php/company-one/v1/employees/112'
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
          workLocation: 'Remote'
        },
        provider: 'bamboo',
        rawPayload: { data: BAMBOO_EMPLOYEE_MOCK, success: true }
      });
    });
  });

  // ------------------------------------

  describe(`${BreadOperationName.EMPLOYEE_CREATE}`, () => {
    beforeEach(async () => {
      (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          status: 201,
          headers: {
            // this has a new id
            location:
              'https://api.bamboohr.com/api/gateway.php/mietest/v1/employees/27'
          }
        } as AxiosResponse)
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
          telephone: '+71231231212'
        }
      });
    }

    it(`should call bamboo API`, async () => {
      await invokeEmployeeCreate();
      expect(axiosMock.request).toHaveBeenCalledWith({
        url:
          'https://api.bamboohr.com/api/gateway.php/company-one/v1/employees',
        method: 'POST',
        data: {
          firstName: 'New',
          lastName: 'Employee',
          workEmail: '2110pro@mail.ru',
          workPhone: '+71231231212'
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          authorization: 'Basic dXNlci1zZWNyZXQta2V5Ong='
        }
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
          telephone: '+71231231212'
        },
        provider: 'bamboo',
        rawPayload: {
          data: {},
          success: true
        }
      });
    });

    it(`should return construct correct error when request failed with 409`, async () => {
      jest.resetAllMocks();

      const error = new Error('Request failed with status code 409');
      Object.assign(error, {
        isAxiosError: true,
        response: {
          status: 409,
          statusText: 'conflict',
          headers: {
            'x-bamboohr-error-messsage': 'Duplicate email, Duplicate email',
            'x-bamboohr-error-message': 'Duplicate email, Duplicate email'
          },
          data: ''
        }
      } as AxiosError);

      (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(error)
      );

      const result = await invokeEmployeeCreate();

      // get what the res.json would send
      expect(JSON.parse(JSON.stringify(result))).toEqual({
        name: 'BREAD/EMPLOYEE/CREATE',
        provider: 'bamboo',
        rawPayload: {
          error: {
            message:
              'bamboo: Request failed with status code 409. Duplicate email',
            originalError: {
              isAxiosError: true,
              response: {
                data: '',
                headers: {
                  'x-bamboohr-error-message':
                    'Duplicate email, Duplicate email',
                  'x-bamboohr-error-messsage':
                    'Duplicate email, Duplicate email'
                },
                status: 409,
                statusText: 'conflict'
              }
            },
            provider: 'bamboo'
          },
          success: false
        }
      });
    });
  });
});
