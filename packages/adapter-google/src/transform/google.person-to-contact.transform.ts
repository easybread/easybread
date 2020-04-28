import { ServiceStringThingException } from '@easybread/core';
import { isString } from 'lodash';
import { Person } from 'schema-dts';

import { GOOGLE_PROVIDER } from '../google.constants';
import { GoogleContactsFeedEntry } from '../interfaces';

export const googlePersonToContactTransform = (
  person: Person
): GoogleContactsFeedEntry => {
  if (isString(person)) {
    throw new ServiceStringThingException(GOOGLE_PROVIDER, 'Person');
  }

  const { givenName, familyName, email, telephone, identifier } = person;

  const contact: GoogleContactsFeedEntry = {};

  contact.gd$name = {};

  if (givenName || familyName) {
    contact.gd$name.gd$fullName = { $t: `${givenName} ${familyName}`.trim() };
  }

  if (givenName) {
    contact.gd$name.gd$givenName = { $t: `${givenName}` };
  }

  if (familyName) {
    contact.gd$name.gd$familyName = { $t: `${familyName}` };
  }

  if (telephone) {
    contact.gd$phoneNumber = [
      {
        $t: `${telephone}`,
        primary: 'true',
        rel: 'http://schemas.google.com/g/2005#work'
      }
    ];
  }

  if (email) {
    contact.gd$email = [
      {
        address: `${email}`,
        primary: 'true',
        rel: 'http://schemas.google.com/g/2005#work'
      }
    ];
  }

  if (identifier) {
    contact.id = {
      $t: `https://www.google.com/m8/feeds/contacts/alexandr2110pro%40gmail.com/full/${identifier}`
    };
  }

  return contact;
};
