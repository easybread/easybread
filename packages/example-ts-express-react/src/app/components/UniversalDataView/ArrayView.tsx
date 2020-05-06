import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { Viewable } from './Viewable';
import { ViewGroupContent } from './ViewGroupContent';
import { ViewGroupLabel } from './ViewGroupLabel';

interface ArrayViewProps {
  value: Viewable[];
  name?: string;
}

export const ArrayView: FC<ArrayViewProps> = ({ value, name }) => {
  return (
    <StyledWrapper>
      <ViewGroupLabel name={name} />
      <ViewGroupContent value={value} indent={true} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-bottom: var(--gap-2);
  margin-top: var(--gap-2);
`;
