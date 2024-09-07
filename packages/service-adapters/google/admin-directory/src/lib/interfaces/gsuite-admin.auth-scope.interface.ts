type ScopesForDevices =
  | 'https://www.googleapis.com/auth/admin.directory.device.chromeos'
  | 'https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.device.mobile'
  | 'https://www.googleapis.com/auth/admin.directory.device.mobile.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.device.mobile.action';

type ScopesForGroups =
  | 'https://www.googleapis.com/auth/admin.directory.group.member'
  | 'https://www.googleapis.com/auth/admin.directory.group.member.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.group'
  | 'https://www.googleapis.com/auth/admin.directory.group.readonly';

type ScopesForOrganizationalUnits =
  | 'https://www.googleapis.com/auth/admin.directory.orgunit'
  | 'https://www.googleapis.com/auth/admin.directory.orgunit.readonly';

type ScopesForUsers =
  | 'https://www.googleapis.com/auth/admin.directory.user'
  | 'https://www.googleapis.com/auth/admin.directory.user.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.user.alias'
  | 'https://www.googleapis.com/auth/admin.directory.user.alias.readonly';

type ScopesForUserSecurityFeatures =
  'https://www.googleapis.com/auth/admin.directory.user.security';

type ScopesForRoleManagement =
  | 'https://www.googleapis.com/auth/admin.directory.rolemanagement'
  | 'https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly';

type ScopesForCustomUserSchemas =
  | 'https://www.googleapis.com/auth/admin.directory.userschema'
  | 'https://www.googleapis.com/auth/admin.directory.userschema.readonly';

type ScopesForNotificaitons =
  'https://www.googleapis.com/auth/admin.directory.notifications';

type ScopesForCustomers =
  | 'https://www.googleapis.com/auth/admin.directory.customer'
  | 'https://www.googleapis.com/auth/admin.directory.customer.readonly';

type ScopesForDomains =
  | 'https://www.googleapis.com/auth/admin.directory.domain'
  | 'https://www.googleapis.com/auth/admin.directory.domain.readonly';

type ScopesForCalendarResources =
  | 'https://www.googleapis.com/auth/admin.directory.resource.calendar'
  | 'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly';

export type GsuiteAdminAuthScope =
  | ScopesForDevices
  | ScopesForGroups
  | ScopesForOrganizationalUnits
  | ScopesForUsers
  | ScopesForUserSecurityFeatures
  | ScopesForRoleManagement
  | ScopesForCustomUserSchemas
  | ScopesForNotificaitons
  | ScopesForCustomers
  | ScopesForDomains
  | ScopesForCalendarResources;
