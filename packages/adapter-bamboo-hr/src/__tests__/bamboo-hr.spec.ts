import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  SetupBasicAuthOperation
} from '@easybread/operations';
import { mockAxios, setExtendedTimeout } from '@easybread/test-utils';
import axiosMock from 'axios';

import { BambooHrAuthStrategy } from '..';
import {
  BambooBasicAuthPayload,
  BambooEmployeesDirectory,
  BambooHrAdapter
} from '../';

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
          data: getEmployeesDirMockData()
        })
      );
    });

    function invokeEmployeeSearch(): Promise<
      EmployeeSearchOperation<BambooEmployeesDirectory>['output']
    > {
      return client.invoke<EmployeeSearchOperation<BambooEmployeesDirectory>>({
        breadId: BREAD_ID,
        name: BreadOperationName.EMPLOYEE_SEARCH
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
        provider: bambooHrAdapter.provider,
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
          }
        ],
        rawPayload: {
          success: true,
          data: getEmployeesDirMockData()
        }
      });
    });
  });

  describe(`${BreadOperationName.EMPLOYEE_CREATE}`, () => {
    beforeEach(async () => {
      (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({ status: 201 })
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
          email: '2110pro@mail.ru',
          familyName: 'Employee',
          givenName: 'New',
          telephone: '+71231231212'
        },
        provider: 'bamboo-hr',
        rawPayload: {
          data: {},
          success: true
        }
      });
    });
  });
});

//  ------------------------------------

// TODO: move to separate file
function getEmployeesDirMockData(): object {
  return {
    employees: [
      {
        canUploadPhoto: 1,
        department: 'IT',
        displayName: 'Test Employee',
        division: 'web',
        firstName: 'Test',
        gender: 'Male',
        id: '112',
        jobTitle: 'JavaScript Developer',
        lastName: 'Employee',
        linkedIn: null,
        location: 'Remote',
        mobilePhone: null,
        photoUploaded: false,
        photoUrl:
          'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
        preferredName: 'T-one',
        workEmail: '2110pro@mail.ru',
        workPhone: '+71231231212',
        workPhoneExtension: null
      }
    ],
    fields: [
      {
        id: 'displayName',
        name: 'Display name',
        type: 'text'
      },
      {
        id: 'firstName',
        name: 'First name',
        type: 'text'
      },
      {
        id: 'lastName',
        name: 'Last name',
        type: 'text'
      },
      {
        id: 'preferredName',
        name: 'Preferred name',
        type: 'text'
      },
      {
        id: 'gender',
        name: 'Gender',
        type: 'gender'
      },
      {
        id: 'jobTitle',
        name: 'Job title',
        type: 'list'
      },
      {
        id: 'workPhone',
        name: 'Work Phone',
        type: 'text'
      },
      {
        id: 'mobilePhone',
        name: 'Mobile Phone',
        type: 'text'
      },
      {
        id: 'workEmail',
        name: 'Work Email',
        type: 'email'
      },
      {
        id: 'department',
        name: 'Department',
        type: 'list'
      },
      {
        id: 'location',
        name: 'Location',
        type: 'list'
      },
      {
        id: 'division',
        name: 'Division',
        type: 'list'
      },
      {
        id: 'linkedIn',
        name: 'LinkedIn URL',
        type: 'text'
      },
      {
        id: 'workPhoneExtension',
        name: 'Work Ext.',
        type: 'text'
      },
      {
        id: 'photoUploaded',
        name: 'Employee photo exists',
        type: 'bool'
      },
      {
        id: 'photoUrl',
        name: 'Employee photo url',
        type: 'url'
      },
      {
        id: 'canUploadPhoto',
        name: '',
        type: 'bool'
      }
    ]
  };
}
