import { find, isArray, isObject } from 'lodash';
import React, { FC, useMemo } from 'react';
import styled from 'styled-components/macro';

import { ViewGroupContent } from './ViewGroupContent';
import { ViewGroupLabel } from './ViewGroupLabel';

interface ObjectViewProps {
  value: object;
  name?: string;
}

function hasNestedObject(value: object): boolean {
  return !!find(value, inner => isObject(inner) || isArray(inner));
}

export const ObjectView: FC<ObjectViewProps> = ({ value, name }) => {
  const indentContent = useMemo(() => !!name && hasNestedObject(value), [
    name,
    value
  ]);

  return (
    <StyledWrapper isRoot={!name}>
      <ViewGroupLabel name={name} />
      <ViewGroupContent value={value} indent={indentContent} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ isRoot: boolean }>`
  display: flex;
  flex-direction: column;

  margin-bottom: var(--gap-2);
  margin-top: var(--gap-2);
`;
