import { GsuiteAdminUsersList } from '../interfaces';

// taken from
// https://developers.google.com/admin-sdk/directory/v1/guides/manage-users#json-response_2
// required some modifications to accommodate the interface.
export const USERS_LIST_MOCK: GsuiteAdminUsersList = {
  kind: 'admin#directory#users',
  etag:
    '"s3sxUbiDZrO_w5pDMy1k-DjAn3hLQ_44DzW8eoBN_pY/Kp6E-E4tFIQl79mPj4J6XhPmaEo"',
  nextPageToken: 'nextpagetoken',
  users: [
    {
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
    },
    {
      kind: 'admin#directory#user',
      id: '109911612007633470839',
      etag:
        '"s3sxUbiDZrO_w5pDMy1k-DjAn3hLQ_44DzW8eoBN_pY/gkbUMq4L6HjUOVrhY-myDEZn50I"',
      primaryEmail: 'will@easybread.io',
      name: {
        givenName: 'William',
        familyName: 'Reiske',
        fullName: 'William Reiske'
      },
      isAdmin: true,
      isDelegatedAdmin: false,
      lastLoginTime: '1970-01-01T00:00:00.000Z',
      creationTime: '2020-05-02T17:41:57.000Z',
      agreedToTerms: true,
      suspended: false,
      archived: false,
      changePasswordAtNextLogin: false,
      ipWhitelisted: false,
      emails: [
        { address: 'will@easybread.io', primary: true },
        { address: 'will@easybread.io.test-google-a.com' }
      ],
      nonEditableAliases: ['will@easybread.io.test-google-a.com'],
      customerId: 'C01tzmkq8',
      orgUnitPath: '/',
      isMailboxSetup: true,
      isEnrolledIn2Sv: false,
      isEnforcedIn2Sv: false,
      includeInGlobalAddressList: true,
      recoveryEmail: 'wreiske@mieweb.com'
    }
  ]
};
