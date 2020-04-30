import { NotString } from '@easybread/common';
import { Person } from 'schema-dts';

import { BreadDataMapDefinition } from './bread.data-map-definition.interface';
import { BreadDataMapper } from './bread.data-mapper';

interface TestEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  contacts?: {
    email?: string;
    phone?: string;
  };
}

class TestDataMapper extends BreadDataMapper<TestEntity, NotString<Person>> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    NotString<Person>,
    TestEntity
  > = {
    contacts: input => {
      return {
        email: input.email ? `${input.email}` : undefined,
        phone: input.telephone ? `${input.telephone}` : undefined
      };
    },
    id: 'identifier',
    firstName: 'givenName',
    lastName: 'familyName'
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    TestEntity,
    NotString<Person>
  > = {
    '@type': () => 'Person',
    identifier: 'id',
    givenName: 'firstName',
    familyName: 'lastName',
    email: input => input.contacts?.email,
    telephone: input => input.contacts?.phone
  };
}

describe('BreadDataMapper', () => {
  const mapper = new TestDataMapper();

  describe('toSchema()', () => {
    it(`should produce correct schema.org entity`, () => {
      const result = mapper.toSchema({
        id: '123',
        firstName: 'Steve',
        lastName: 'Jobs',
        contacts: {
          email: 'test@mail.com',
          phone: '+32223338877'
        }
      });
      expect(result).toEqual({
        '@type': 'Person',
        email: 'test@mail.com',
        familyName: 'Jobs',
        givenName: 'Steve',
        identifier: '123',
        telephone: '+32223338877'
      });
    });

    it(`should set undefined if property is empty`, () => {
      const result = mapper.toSchema({
        id: '123',
        firstName: 'Steve',
        contacts: {
          email: 'test@mail.com'
        }
      });
      expect(result).toEqual({
        '@type': 'Person',
        email: 'test@mail.com',
        givenName: 'Steve',
        identifier: '123'
      });
    });
  });

  describe('toRemote()', () => {
    it(`should produce correct entity`, () => {
      const result = mapper.toRemote({
        '@type': 'Person',
        email: 'test@mail.com',
        familyName: 'Jobs',
        givenName: 'Steve',
        identifier: '123',
        telephone: '+32223338877'
      });

      expect(result).toEqual({
        contacts: {
          email: 'test@mail.com',
          phone: '+32223338877'
        },
        firstName: 'Steve',
        id: '123',
        lastName: 'Jobs'
      });
    });
  });
});
