import { GsuiteAdminAddress } from './gsuite-admin.address.interface';

export type GsuiteAdminUser = {
  kind: 'admin#directory#user';
  id?: string;
  etag?: string;
  primaryEmail?: string;
  name?: {
    givenName?: string;
    familyName?: string;
    fullName?: string;
  };
  isAdmin?: boolean;
  isDelegatedAdmin?: boolean;
  lastLoginTime?: string;
  creationTime?: string;
  deletionTime?: string;
  agreedToTerms?: boolean;
  password?: string;
  hashFunction?: string;
  suspended?: boolean;
  suspensionReason?: string;
  archived?: boolean;
  changePasswordAtNextLogin?: boolean;
  ipWhitelisted?: boolean;
  ims?: {
    type?: string;
    customType?: string;
    protocol?: string;
    customProtocol?: string;
    im?: string;
    primary?: boolean;
  }[];
  emails?: {
    address?: string;
    type?: string;
    customType?: string;
    primary?: boolean;
  }[];
  externalIds?: {
    value?: string;
    type?: string;
    customType?: string;
  }[];
  relations?: {
    value?: string;
    type?: string;
    customType?: string;
  }[];
  addresses?: GsuiteAdminAddress[];
  organizations?: {
    name?: string;
    title?: string;
    primary?: boolean;
    type?: string;
    customType?: string;
    department?: string;
    symbol?: string;
    location?: string;
    description?: string;
    domain?: string;
    costCenter?: string;
    fullTimeEquivalent?: number;
  }[];
  phones?: {
    value?: string;
    primary?: boolean;
    type?: string;
    customType?: string;
  }[];
  languages?: {
    languageCode?: string;
    customLanguage?: string;
  }[];
  posixAccounts?: {
    username?: string;
    uid?: string;
    gid?: string;
    homeDirectory?: string;
    shell?: string;
    gecos?: string;
    systemId?: string;
    primary?: boolean;
    accountId?: string;
    operatingSystemType?: string;
  }[];
  sshPublicKeys?: {
    key?: string;
    expirationTimeUsec?: string;
    fingerprint?: string;
  }[];
  aliases?: string[];
  nonEditableAliases?: string[];
  notes?: {
    value?: string;
    contentType?: string;
  };
  websites?: {
    value?: string;
    primary?: boolean;
    type?: string;
    customType?: string;
  }[];
  locations?: {
    type?: string;
    customType?: string;
    area?: string;
    buildingId?: string;
    floorName?: string;
    floorSection?: string;
    deskCode?: string;
  }[];
  keywords?: {
    type?: string;
    customType?: string;
    value?: string;
  }[];
  gender?: {
    type?: string;
    customGender?: string;
    addressMeAs?: string;
  };
  customerId?: string;
  orgUnitPath?: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  isMailboxSetup?: boolean;
  isEnrolledIn2Sv?: boolean;
  isEnforcedIn2Sv?: boolean;
  includeInGlobalAddressList?: boolean;
  thumbnailPhotoUrl?: string;
  thumbnailPhotoEtag?: string;
  customSchemas?: {
    (key: string): {
      (key: string): unknown;
    };
  };
};
