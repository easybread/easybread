import { isArray, isNumber, isObject, isString } from 'lodash';
import React, { FC } from 'react';

import { ArrayView } from './ArrayView';
import { ObjectView } from './ObjectView';
import { StringView } from './StringView';
import { Viewable } from './Viewable';

interface ObjectPropertyValueViewProps {
  value?: Viewable;
  name?: string;
}

export const ValueView: FC<ObjectPropertyValueViewProps> = ({
  value,
  name
}) => {
  if (!value) return null;

  if (isString(value)) return <StringView value={value} name={name} />;
  if (isNumber(value)) return <StringView value={`${value}`} name={name} />;

  if (isArray(value)) {
    return <ArrayView value={value} name={name} />;
  }

  if (isObject(value)) {
    return <ObjectView value={value} name={name} />;
  }

  return null;
};
