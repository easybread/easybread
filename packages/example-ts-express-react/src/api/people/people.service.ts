import {
  BambooEmployee,
  BambooEmployeesDirectory
} from '@easybread/adapter-bamboo-hr';
import {
  GoogleContactsOperationName,
  GoogleContactsPeopleByIdOperation,
  GoogleContactsPeopleCreateOperation,
  GoogleContactsPeopleDeleteOperation,
  GoogleContactsPeopleSearchOperation,
  GoogleContactsPeopleUpdateOperation
} from '@easybread/adapter-google-contacts';
import {
  GsuiteAdminOperationName,
  GsuiteAdminUsersByIdOperation,
  GsuiteAdminUsersCreateOperation,
  GsuiteAdminUsersDeleteOperation,
  GsuiteAdminUsersSearchOperation,
  GsuiteAdminUsersUpdateOperation
} from '@easybread/adapter-gsuite-admin';
import {
  BreadOperationName,
  EmployeeByIdOperation,
  EmployeeCreateOperation,
  EmployeeSearchOperation,
  EmployeeUpdateOperation
} from '@easybread/operations';
import { PersonSchema } from '@easybread/schemas';

import {
  bambooHrClient,
  googleContactsClient,
  gsuiteAdminClient
} from '../shared';

export class PeopleService {
  // SEARCH ------------------------------------

  static searchGoogleContacts(
    breadId: string,
    query?: string
  ): Promise<GoogleContactsPeopleSearchOperation['output']> {
    return googleContactsClient.invoke<GoogleContactsPeopleSearchOperation>({
      name: GoogleContactsOperationName.PEOPLE_SEARCH,
      breadId,
      params: { query },
      pagination: null
    });
  }

  static searchGsuiteAdmin(
    breadId: string,
    query?: string
  ): Promise<GsuiteAdminUsersSearchOperation['output']> {
    return gsuiteAdminClient.invoke<GsuiteAdminUsersSearchOperation>({
      name: GsuiteAdminOperationName.USERS_SEARCH,
      breadId,
      params: { query },
      pagination: null
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
      params: { query },
      pagination: null
    });
  }

  // GET BY ID ------------------------------------

  static byIdGoogleContacts(
    breadId: string,
    id: string
  ): Promise<GoogleContactsPeopleByIdOperation['output']> {
    return googleContactsClient.invoke<GoogleContactsPeopleByIdOperation>({
      name: GoogleContactsOperationName.PEOPLE_BY_ID,
      breadId,
      params: { identifier: id }
    });
  }

  static byIdGsuite(
    breadId: string,
    id: string
  ): Promise<GsuiteAdminUsersByIdOperation['output']> {
    return gsuiteAdminClient.invoke<GsuiteAdminUsersByIdOperation>({
      name: GsuiteAdminOperationName.USERS_BY_ID,
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
  ): Promise<GoogleContactsPeopleCreateOperation['output']> {
    return googleContactsClient.invoke<GoogleContactsPeopleCreateOperation>({
      name: GoogleContactsOperationName.PEOPLE_CREATE,
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

  static createGsuiteUser(
    breadId: string,
    person: PersonSchema
  ): Promise<GsuiteAdminUsersCreateOperation['output']> {
    return gsuiteAdminClient.invoke<GsuiteAdminUsersCreateOperation>({
      name: GsuiteAdminOperationName.USERS_CREATE,
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
  ): Promise<GoogleContactsPeopleUpdateOperation['output']> {
    return googleContactsClient.invoke<GoogleContactsPeopleUpdateOperation>({
      name: GoogleContactsOperationName.PEOPLE_UPDATE,
      breadId,
      payload: person
    });
  }

  static updateGsuiteUser(
    breadId: string,
    person: PersonSchema
  ): Promise<GsuiteAdminUsersUpdateOperation['output']> {
    return gsuiteAdminClient.invoke<GsuiteAdminUsersUpdateOperation>({
      name: GsuiteAdminOperationName.USERS_UPDATE,
      breadId,
      payload: person
    });
  }

  // DELETE ------------------------------------

  static deleteGoogleContact(
    breadId: string,
    id: string
  ): Promise<GoogleContactsPeopleDeleteOperation['output']> {
    return googleContactsClient.invoke<GoogleContactsPeopleDeleteOperation>({
      name: GoogleContactsOperationName.PEOPLE_DELETE,
      breadId,
      payload: { '@type': 'Person', identifier: id }
    });
  }

  static deleteGsuiteUser(
    breadId: string,
    id: string
  ): Promise<GsuiteAdminUsersDeleteOperation['output']> {
    return gsuiteAdminClient.invoke<GsuiteAdminUsersDeleteOperation>({
      name: GsuiteAdminOperationName.USERS_DELETE,
      breadId,
      payload: { '@type': 'Person', identifier: id }
    });
  }
}
