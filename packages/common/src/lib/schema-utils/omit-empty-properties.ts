import { isNull, isUndefined, omitBy, overSome } from 'lodash/fp';

export const omitEmptyProperties = omitBy(overSome([isNull, isUndefined]));
