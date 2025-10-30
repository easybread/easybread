import { type ValueOf, enumObject } from '@easybread/common';

import { connectionTypeEnum } from '../schema/schema';

/**
 * @see {import('saas-db').connectionTypeEnum}
 */
export const PG_CONNECTION_TYPE = enumObject(connectionTypeEnum.enumValues);

/**
 * @see {connectionTypeEnum}
 */
export type PgConnectionType = ValueOf<typeof PG_CONNECTION_TYPE>;
