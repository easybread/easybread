import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  BreadOperationName,
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

  // TODO: replace with multiple tests
  it(`should work`, async () => {
    const API_KEY = 'user-secret-key';
    const USER_ID = 'user-one';
    const COMPANY_NAME = 'company-one';

    const authResult = await client.invoke<
      SetupBasicAuthOperation<BambooBasicAuthPayload>
    >({
      breadId: USER_ID,
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

    (axiosMock.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: getEmployeesDirMockData()
      })
    );

    const employees = await client.invoke<
      EmployeeSearchOperation<BambooEmployeesDirectory>
    >({
      breadId: USER_ID,
      name: BreadOperationName.EMPLOYEE_SEARCH
    });

    expect(axiosMock.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `https://api.bamboohr.com/api/gateway.php/${COMPANY_NAME}/v1/employees/directory`,
      headers: {
        accept: 'application/json',
        authorization: expect.stringMatching(/Basic .+/)
      }
    });

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
