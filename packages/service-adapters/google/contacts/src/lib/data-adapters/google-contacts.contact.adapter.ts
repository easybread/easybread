import { breadDataAdapter } from '@easybread/data-adapter';
import { OrganizationSchema, PersonSchema } from '@easybread/schemas';
import { GoogleContactsFeedEntry } from '../interfaces';
import { stringOrArrayToString } from '@easybread/common';
import {
  GdataEmail,
  GdataName,
  GdataOrganization,
  GdataPhoneNumber,
} from '../interfaces/gdata';

export const googleContactsContactAdapter = breadDataAdapter<
  PersonSchema,
  GoogleContactsFeedEntry
>({
  toExternal: {
    id: (input) => createId(input),
    gd$name: (input) => createGDName(input),
    gd$email: (input) => createGDEmail(stringOrArrayToString(input.email)),
    gd$phoneNumber: (input) => {
      return createGDPhoneNumber(stringOrArrayToString(input.telephone));
    },

    // TODO: add missing fields:
    //       - jobTitle
    //       - worksFor
  },
  toInternal: {
    '@type': () => 'Person',
    identifier: (input) => getIdFromLink(input.id?.$t),
    email: (input) =>
      input.gd$email?.find((m) => m.primary === 'true')?.address,
    name: (input) => input.gd$name?.gd$fullName?.$t,
    givenName: (input) => input.gd$name?.gd$givenName?.$t,
    familyName: (input) => input.gd$name?.gd$familyName?.$t,
    additionalName: (input) => input.gd$name?.gd$additionalName?.$t,
    honorificPrefix: (input) => input.gd$name?.gd$namePrefix?.$t,
    honorificSuffix: (input) => input.gd$name?.gd$nameSuffix?.$t,
    jobTitle: (input) => getContactOrganization(input)?.gd$orgTitle?.$t,
    worksFor: (input) => createWorksFor(input),
    telephone: (input) => findPrimaryPhoneNumber(input)?.$t,
  },
});

function createId(p: PersonSchema) {
  return p.identifier
    ? {
        $t: `https://www.google.com/m8/feeds/contacts/alexandr2110pro%40gmail.com/full/${p.identifier}`,
      }
    : undefined;
}

function createGDName(person: PersonSchema): GdataName | undefined {
  const {
    givenName,
    familyName,
    additionalName,
    name,
    honorificPrefix,
    honorificSuffix,
  } = person;

  if (
    !givenName &&
    !familyName &&
    !additionalName &&
    !name &&
    !honorificPrefix &&
    !honorificSuffix
  ) {
    return undefined;
  }

  const gdName: GdataName = {};

  if (name) {
    gdName.gd$fullName = { $t: `${name}` };
  } else if (givenName || familyName) {
    gdName.gd$fullName = { $t: `${givenName} ${familyName}`.trim() };
  }

  if (givenName) {
    gdName.gd$givenName = { $t: `${givenName}` };
  }

  if (familyName) {
    gdName.gd$familyName = { $t: `${familyName}` };
  }
  if (additionalName) {
    gdName.gd$additionalName = { $t: `${additionalName}` };
  }
  if (honorificSuffix) {
    gdName.gd$nameSuffix = { $t: `${honorificSuffix}` };
  }
  if (honorificPrefix) {
    gdName.gd$namePrefix = { $t: `${honorificPrefix}` };
  }

  return gdName;
}

function createGDEmail(email: string | undefined): GdataEmail[] | undefined {
  return email
    ? [
        {
          address: email,
          primary: 'true',
          rel: 'http://schemas.google.com/g/2005#work',
        },
      ]
    : undefined;
}
function createGDPhoneNumber(
  telephone: string | undefined
): GdataPhoneNumber[] | undefined {
  return telephone
    ? [
        {
          $t: telephone,
          primary: 'true',
          rel: 'http://schemas.google.com/g/2005#work',
        },
      ]
    : undefined;
}

function getIdFromLink(idLink: string | undefined): string | undefined {
  if (!idLink) return undefined;

  // like http://www.google.com/m8/feeds/contacts/testmail%40gmail.com/base/800b654893678c4
  return idLink.replace(/.+\/([^/]+)$/, '$1');
}

function getContactOrganization(
  contact: GoogleContactsFeedEntry
): undefined | GdataOrganization {
  return contact.gd$organization ? contact.gd$organization[0] : undefined;
}

function createWorksFor(
  input: GoogleContactsFeedEntry
): OrganizationSchema | undefined {
  const name = getContactOrganization(input)?.gd$orgName?.$t;
  return name ? { '@type': 'Organization', name } : undefined;
}

function findPrimaryPhoneNumber(
  input: GoogleContactsFeedEntry
): undefined | GdataPhoneNumber {
  const { gd$phoneNumber } = input;
  return gd$phoneNumber
    ? gd$phoneNumber.find((p) => p.primary === 'true') || gd$phoneNumber[0]
    : undefined;
}
