export type GoogleAdminDirectoryDeviceScope =
  | 'https://www.googleapis.com/auth/admin.directory.device.chromeos'
  | 'https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.device.mobile'
  | 'https://www.googleapis.com/auth/admin.directory.device.mobile.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.device.mobile.action';

export type GoogleAdminDirectoryGroupScope =
  | 'https://www.googleapis.com/auth/admin.directory.group.member'
  | 'https://www.googleapis.com/auth/admin.directory.group.member.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.group'
  | 'https://www.googleapis.com/auth/admin.directory.group.readonly';

export type GoogleAdminDirectoryOrganizationalUnitScope =
  | 'https://www.googleapis.com/auth/admin.directory.orgunit'
  | 'https://www.googleapis.com/auth/admin.directory.orgunit.readonly';

export type GoogleAdminDirectoryUserScope =
  | 'https://www.googleapis.com/auth/admin.directory.user'
  | 'https://www.googleapis.com/auth/admin.directory.user.readonly'
  | 'https://www.googleapis.com/auth/admin.directory.user.alias'
  | 'https://www.googleapis.com/auth/admin.directory.user.alias.readonly';

export type GoogleAdminDirectoryUserSecurityFeaturesScope =
  'https://www.googleapis.com/auth/admin.directory.user.security';

export type GoogleAdminDirectoryRoleManagementScope =
  | 'https://www.googleapis.com/auth/admin.directory.rolemanagement'
  | 'https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly';

export type GoogleAdminDirectoryCustomUserSchemaScope =
  | 'https://www.googleapis.com/auth/admin.directory.userschema'
  | 'https://www.googleapis.com/auth/admin.directory.userschema.readonly';

export type GoogleAdminDirectoryNotificationsScope =
  'https://www.googleapis.com/auth/admin.directory.notifications';

export type GoogleAdminDirectoryCustomersScope =
  | 'https://www.googleapis.com/auth/admin.directory.customer'
  | 'https://www.googleapis.com/auth/admin.directory.customer.readonly';

export type GoogleAdminDirectoryDomainsScope =
  | 'https://www.googleapis.com/auth/admin.directory.domain'
  | 'https://www.googleapis.com/auth/admin.directory.domain.readonly';

export type GoogleAdminDirectoryCalendarScope =
  | 'https://www.googleapis.com/auth/admin.directory.resource.calendar'
  | 'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly';

export type GoogleAdminDirectoryCloudPlatformScope =
  'https://www.googleapis.com/auth/cloud-platform';

export type GoogleAdminDirectoryAuthScope =
  | GoogleAdminDirectoryDeviceScope
  | GoogleAdminDirectoryGroupScope
  | GoogleAdminDirectoryOrganizationalUnitScope
  | GoogleAdminDirectoryUserScope
  | GoogleAdminDirectoryUserSecurityFeaturesScope
  | GoogleAdminDirectoryRoleManagementScope
  | GoogleAdminDirectoryCustomUserSchemaScope
  | GoogleAdminDirectoryNotificationsScope
  | GoogleAdminDirectoryCustomersScope
  | GoogleAdminDirectoryDomainsScope
  | GoogleAdminDirectoryCalendarScope
  | GoogleAdminDirectoryCloudPlatformScope;
