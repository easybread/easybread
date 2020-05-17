import { GsuiteAdminUser } from '../interfaces';

export const USERS_BY_ID_MOCK: GsuiteAdminUser = {
  kind: 'admin#directory#user',
  id: '114190879825460327746',
  etag:
    '"s3sxUbiDZrO_w5pDMy1k-DjAn3hLQ_44DzW8eoBN_pY/Lwahpzn1AxHbXw1P-kWjgR21BCI"',
  primaryEmail: 'alex@easybread.io',
  name: {
    givenName: 'Alexandr',
    familyName: 'Cherednichenko',
    fullName: 'Alexandr Cherednichenko'
  },
  isAdmin: true,
  isDelegatedAdmin: false,
  lastLoginTime: '2020-05-08T16:54:36.000Z',
  creationTime: '2020-05-02T17:48:45.000Z',
  agreedToTerms: true,
  suspended: false,
  archived: false,
  changePasswordAtNextLogin: false,
  ipWhitelisted: false,
  emails: [
    { address: 'alex@easybread.io', primary: true },
    { address: 'alex@easybread.io.test-google-a.com' },
    { address: 'Alexandr@easybread.io' },
    { address: 'Alexandr@easybread.io.test-google-a.com' }
  ],
  aliases: ['Alexandr@easybread.io'],
  nonEditableAliases: [
    'Alexandr@easybread.io.test-google-a.com',
    'alex@easybread.io.test-google-a.com'
  ],
  customerId: 'C01tzmkq8',
  orgUnitPath: '/',
  isMailboxSetup: true,
  isEnrolledIn2Sv: false,
  isEnforcedIn2Sv: false,
  includeInGlobalAddressList: true
};
