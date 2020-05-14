import { stringOrArrayToString } from '@easybread/common';
import { BreadDataMapDefinition, BreadDataMapper } from '@easybread/core';
import { OrganizationSchema, PersonSchema } from '@easybread/schemas';

import { GoogleContactsFeedEntry } from '../interfaces';
import {
  GdataEmail,
  GdataName,
  GdataOrganization,
  GdataPhoneNumber,
  GdataText
} from '../interfaces/gdata';

export class GoogleContactsContactMapper extends BreadDataMapper<
  GoogleContactsFeedEntry,
  PersonSchema
> {
  protected readonly toRemoteMap: BreadDataMapDefinition<
    PersonSchema,
    GoogleContactsFeedEntry
  > = {
    id: input => this.createId(input),
    gd$name: input => this.createGDName(input),
    gd$email: input => this.createGDEmail(stringOrArrayToString(input.email)),
    gd$phoneNumber: input => {
      return this.createGDPhoneNumber(stringOrArrayToString(input.telephone));
    }
    // TODO: add missing fields:
    //       - jobTitle
    //       - worksFor
  };

  protected readonly toSchemaMap: BreadDataMapDefinition<
    GoogleContactsFeedEntry,
    PersonSchema
  > = {
    '@type': _ => 'Person',
    identifier: input => this.getIdFromLink(input.id?.$t),
    email: input => input.gd$email?.find(m => m.primary === 'true')?.address,
    name: input => input.gd$name?.gd$fullName?.$t,
    givenName: input => input.gd$name?.gd$givenName?.$t,
    familyName: input => input.gd$name?.gd$familyName?.$t,
    additionalName: input => input.gd$name?.gd$additionalName?.$t,
    honorificPrefix: input => input.gd$name?.gd$namePrefix?.$t,
    honorificSuffix: input => input.gd$name?.gd$nameSuffix?.$t,
    jobTitle: input => this.getContactOrganization(input)?.gd$orgTitle?.$t,
    worksFor: input => this.createWorksFor(input),
    telephone: input => this.findPrimaryPhoneNumber(input)?.$t
  };

  //  ------------------------------------

  private createGDPhoneNumber(
    telephone: string | undefined
  ): GdataPhoneNumber[] | undefined {
    return telephone
      ? [
          {
            $t: telephone,
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#work'
          }
        ]
      : undefined;
  }

  private createGDEmail(email: string | undefined): GdataEmail[] | undefined {
    return email
      ? [
          {
            address: email,
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#work'
          }
        ]
      : undefined;
  }

  private createGDName(person: PersonSchema): GdataName | undefined {
    const {
      givenName,
      familyName,
      additionalName,
      name,
      honorificPrefix,
      honorificSuffix
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

  private createId({ identifier }: PersonSchema): GdataText | undefined {
    return identifier
      ? {
          $t: `https://www.google.com/m8/feeds/contacts/alexandr2110pro%40gmail.com/full/${identifier}`
        }
      : undefined;
  }

  private createWorksFor(
    input: GoogleContactsFeedEntry
  ): OrganizationSchema | undefined {
    const name = this.getContactOrganization(input)?.gd$orgName?.$t;
    return name ? { '@type': 'Organization', name } : undefined;
  }

  private getContactOrganization(
    contact: GoogleContactsFeedEntry
  ): undefined | GdataOrganization {
    return contact.gd$organization ? contact.gd$organization[0] : undefined;
  }

  private findPrimaryPhoneNumber(
    input: GoogleContactsFeedEntry
  ): undefined | GdataPhoneNumber {
    const { gd$phoneNumber } = input;
    return gd$phoneNumber
      ? gd$phoneNumber.find(p => p.primary === 'true') || gd$phoneNumber[0]
      : undefined;
  }

  private getIdFromLink(idLink: string | undefined): string | undefined {
    if (!idLink) return undefined;

    // like http://www.google.com/m8/feeds/contacts/testmail%40gmail.com/base/800b654893678c4
    return idLink.replace(/.+\/([^\/]+)$/, '$1');
  }
}
