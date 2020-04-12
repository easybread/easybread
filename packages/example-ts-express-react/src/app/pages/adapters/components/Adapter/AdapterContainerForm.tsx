import React, { FC } from 'react';
import styled, { css } from 'styled-components/macro';

import { Expandable } from './Expandable';

interface AdapterContainerFormProps {
  expanded: boolean;
}

export const AdapterContainerForm: FC<AdapterContainerFormProps> = ({
  expanded,
  children
}) => {
  return <StyledAdapterForm expanded={expanded}>{children}</StyledAdapterForm>;
};

const displayNone = css`
  display: none;
`;

const StyledAdapterForm = styled.div<Expandable>`
  ${p => !p.expanded && displayNone};
`;
