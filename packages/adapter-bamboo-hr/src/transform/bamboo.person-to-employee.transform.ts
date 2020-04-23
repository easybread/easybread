import { ServiceException } from '@easybread/core';
import { Person } from 'schema-dts';

import { BambooEmployee } from '../interfaces';

export const bambooPersonToEmployeeTransform = (
  person: Person
): BambooEmployee => {
  if (typeof person === 'string') {
    throw new ServiceException('bamboo-hr', 'string Person is not supported');
  }

  const { givenName, familyName, email, telephone } = person;

  const employee: BambooEmployee = {};

  if (givenName) {
    employee.firstName = `${givenName}`;
  }
  if (familyName) {
    employee.lastName = `${familyName}`;
  }
  if (email) {
    employee.workEmail = `${email}`;
  }
  if (telephone) {
    employee.workPhone = `${telephone}`;
  }

  return employee;
};
