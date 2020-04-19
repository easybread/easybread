import { Person } from 'schema-dts';

import { GoogleContactsFeedEntry } from '../interfaces';

export const googleContactToPersonTransform = (
  contact: GoogleContactsFeedEntry
): Person => {
  const person: Person = { '@type': 'Person' };
  const {
    // TODO: figure out schema.org representation for this field
    // gContact$groupMembershipInfo,
    // TODO: figure out schema.org representation for this field
    // gContact$website,
    gd$email,
    // TODO: figure out schema.org representation for this field
    // gd$extendedProperty,
    gd$name,
    gd$organization,
    gd$phoneNumber,
    id
    // TODO: figure out schema.org representation for this field
    //       it is an array of links to 'self', 'edit' and 'image'
    // link,
    // TODO: figure out schema.org representation for this field
    // title
  } = contact;

  if (gd$email) {
    person.email = gd$email.find(m => m.primary === 'true')?.address;
  }

  if (gd$name) {
    person.name = gd$name.gd$fullName?.$t;
    person.givenName = gd$name.gd$givenName?.$t;
    person.familyName = gd$name.gd$familyName?.$t;
    person.additionalName = gd$name.gd$additionalName?.$t;
    person.honorificSuffix = gd$name.gd$nameSuffix?.$t;
    person.honorificPrefix = gd$name.gd$namePrefix?.$t;
  }

  if (gd$organization && gd$organization.length) {
    // TODO: what to do if there're many organisations.
    const org = gd$organization[0];

    person.jobTitle = org.gd$orgTitle?.$t;

    person.worksFor = { '@type': 'Organization' };
    person.worksFor.name = org.gd$orgName?.$t;
  }

  if (gd$phoneNumber && gd$phoneNumber.length) {
    // TODO: what to do if there're many phones.
    // TODO: figure out the type of the phone by `rel`
    const tel =
      gd$phoneNumber.find(p => p.primary === 'true') || gd$phoneNumber[0];

    person.telephone = tel.$t;
  }

  if (id) {
    person.identifier = id.$t;
  }

  return person;
};
