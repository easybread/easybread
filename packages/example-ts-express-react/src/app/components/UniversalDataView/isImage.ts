import { isString } from 'lodash';

import { Viewable } from './Viewable';

const IMAGE_REGEXP = /\/photos?\/|\/images?\/|\.(jpe?g|png|svg|bmp)/;

export const isImage = (value: Viewable): value is string => {
  return isString(value) && IMAGE_REGEXP.test(value);
};
