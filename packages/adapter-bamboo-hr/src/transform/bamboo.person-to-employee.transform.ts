import { ServiceStringThingException } from '@easybread/core';
import { isString } from 'lodash';
import { Person } from 'schema-dts';

import { BAMBOO_HR_PROVIDER } from '../bamboo-hr.constants';
import { BambooEmployee } from '../interfaces';

export const bambooPersonToEmployeeTransform = (
  person: Person
): BambooEmployee => {
  if (isString(person)) {
    throw new ServiceStringThingException(BAMBOO_HR_PROVIDER, 'Person');
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
