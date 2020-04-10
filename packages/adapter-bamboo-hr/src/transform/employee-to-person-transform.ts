import { omitEmptyProperties } from '@easybread/common';
import { Person } from 'schema-dts';

import { BambooEmployee } from '../interfaces';

export const employeeToPersonTransform = (
  bambooEmployee: BambooEmployee
): Person => {
  // TODO: how to represent commented out fields in the Person schema
  const {
    id,
    // canUploadPhoto,
    // department,
    displayName,
    // division,
    firstName,
    gender,
    jobTitle,
    lastName,
    // linkedIn,
    location,
    mobilePhone,
    // photoUploaded,
    photoUrl,
    // preferredName,
    workEmail,
    workPhone
    // workPhoneExtension
  } = bambooEmployee;

  const result: Person = { '@type': 'Person' };

  // TODO: work on typing for this
  return Object.assign(
    {},
    result,
    omitEmptyProperties({
      '@type': 'Person',
      identifier: id,
      gender,
      jobTitle,
      familyName: lastName,
      givenName: firstName,
      telephone: workPhone || mobilePhone,
      email: workEmail,
      name: displayName,
      image: photoUrl,
      // TODO: or homeLocation????
      // TODO: proper object structure
      workLocation: location
    })
  );
};
