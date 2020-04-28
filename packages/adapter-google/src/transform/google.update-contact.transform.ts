import { cloneDeep, merge } from 'lodash';

import { GoogleContactsFeedEntry } from '../interfaces';

export const googleUpdateContactTransform = (
  baseEntry: GoogleContactsFeedEntry,
  updateEntry: GoogleContactsFeedEntry
): GoogleContactsFeedEntry => {
  const baseEntryClone = cloneDeep<GoogleContactsFeedEntry>(baseEntry);

  const {
    gd$email,
    gd$phoneNumber,
    gd$name,
    title,
    // TODO: handle commented out fields
    // gContact$groupMembershipInfo,
    // gContact$website,
    // gd$extendedProperty,
    gd$organization
    // link
  } = updateEntry;

  if (title) {
    baseEntryClone.title = { $t: title.$t };
  }

  if (gd$email && gd$email.length) {
    if (!baseEntryClone.gd$email) baseEntryClone.gd$email = [];
    updateArrayField(
      baseEntryClone.gd$email,
      gd$email,
      (base, update) => base.rel === update.rel,
      (base, update) => {
        base.address = update.address;
      }
    );
  }

  if (gd$phoneNumber && gd$phoneNumber.length) {
    if (!baseEntryClone.gd$phoneNumber) baseEntryClone.gd$phoneNumber = [];
    updateArrayField(
      baseEntryClone.gd$phoneNumber,
      gd$phoneNumber,
      (base, update) => base.rel === update.rel,
      (base, update) => {
        base.$t = update.$t;
        base.uri = update.uri;
      }
    );
  }

  if (gd$name) {
    merge(baseEntryClone.gd$name, gd$name);
  }

  if (gd$organization) {
    if (!baseEntryClone.gd$organization) baseEntryClone.gd$organization = [];
    updateArrayField(
      baseEntryClone.gd$organization,
      gd$organization,
      (base, update) => base.rel === update.rel,
      (base, update) => {
        merge(base, update);
      }
    );
  }

  return baseEntryClone;
};

// ------------------------------------

function updateArrayField<TField>(
  baseValues: TField[],
  updateValues: TField[],
  matcher: (base: TField, update: TField) => boolean,
  updater: (base: TField, update: TField) => void
): void {
  updateValues.forEach(update => {
    const base = baseValues.find(base => matcher(base, update));

    if (base) {
      updater(base, update);
    } else {
      baseValues.push(update);
    }
  });
}
