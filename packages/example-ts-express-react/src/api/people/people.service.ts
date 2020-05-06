import {
  BambooEmployee,
  BambooEmployeesDirectory
} from '@easybread/adapter-bamboo-hr';
import {
  GoogleOperationName,
  GooglePeopleByIdOperation,
  GooglePeopleCreateOperation,
  GooglePeopleDeleteOperation,
  GooglePeopleSearchOperation,
  GooglePeopleUpdateOperation
} from '@easybread/adapter-google';
import {
  BreadOperationName,
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  EmployeeUpdateOperation
} from '@easybread/operations';
import { PersonSchema } from '@easybread/schemas';

import { bambooHrClient, googleClient } from '../shared';

export class PeopleService {
  // SEARCH ------------------------------------

  static searchGoogle(
    breadId: string,
    query?: string
  ): Promise<GooglePeopleSearchOperation['output']> {
    return googleClient.invoke<GooglePeopleSearchOperation>({
      name: GoogleOperationName.PEOPLE_SEARCH,
      breadId,
      params: { query }
    });
  }

  static searchBamboo(
    breadId: string,
    query?: string
  ): Promise<EmployeeSearchOperation<BambooEmployeesDirectory>['output']> {
    return bambooHrClient.invoke<
      EmployeeSearchOperation<BambooEmployeesDirectory>
    >({
      name: BreadOperationName.EMPLOYEE_SEARCH,
      breadId,
      params: { query }
    });
  }

  // GET BY ID ------------------------------------

  static byIdGoogle(
    breadId: string,
    id: string
  ): Promise<GooglePeopleByIdOperation['output']> {
    return googleClient.invoke<GooglePeopleByIdOperation>({
      name: GoogleOperationName.PEOPLE_BY_ID,
      breadId,
      params: { identifier: id }
    });
  }

  static byIdBamboo(
    breadId: string,
    id: string
  ): Promise<EmployeeByIdOperation<BambooEmployee>['output']> {
    return bambooHrClient.invoke<EmployeeByIdOperation<BambooEmployee>>({
      name: BreadOperationName.EMPLOYEE_BY_ID,
      breadId,
      params: { identifier: id }
    });
  }

  // CREATE ------------------------------------

  static createGoogleContact(
    breadId: string,
    person: PersonSchema
  ): Promise<GooglePeopleCreateOperation['output']> {
    return googleClient.invoke<GooglePeopleCreateOperation>({
      name: GoogleOperationName.PEOPLE_CREATE,
      breadId,
      payload: person
    });
  }

  static createBambooEmployee(
    breadId: string,
    person: PersonSchema
  ): Promise<EmployeeCreateOperation['output']> {
    return bambooHrClient.invoke<EmployeeCreateOperation>({
      name: BreadOperationName.EMPLOYEE_CREATE,
      breadId,
      payload: person
    });
  }

  // UPDATE ------------------------------------

  static updateBambooEmployee(
    breadId: string,
    person: PersonSchema
  ): Promise<EmployeeUpdateOperation['output']> {
    return bambooHrClient.invoke<EmployeeUpdateOperation>({
      name: BreadOperationName.EMPLOYEE_UPDATE,
      breadId,
      payload: person
    });
  }

  static updateGoogleContact(
    breadId: string,
    person: PersonSchema
  ): Promise<GooglePeopleUpdateOperation['output']> {
    return googleClient.invoke<GooglePeopleUpdateOperation>({
      name: GoogleOperationName.PEOPLE_UPDATE,
      breadId,
      payload: person
    });
  }

  // DELETE ------------------------------------

  static deleteGoogleContact(
    breadId: string,
    id: string
  ): Promise<GooglePeopleDeleteOperation['output']> {
    return googleClient.invoke<GooglePeopleDeleteOperation>({
      name: GoogleOperationName.PEOPLE_DELETE,
      breadId,
      payload: { '@type': 'Person', identifier: id }
    });
  }
}
