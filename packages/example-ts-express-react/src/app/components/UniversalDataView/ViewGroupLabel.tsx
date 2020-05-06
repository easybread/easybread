import React, { FC } from 'react';
import styled from 'styled-components/macro';

interface ObjectViewLabelProps {
  name?: string;
}

export const ViewGroupLabel: FC<ObjectViewLabelProps> = ({ name }) => {
  if (!name) return null;
  return <StyledViewLabel>{name}</StyledViewLabel>;
};

const StyledViewLabel = styled.div`
  display: flex;
  padding: var(--gap-2) var(--gap-3);
  color: var(--text-brand-color-mid);
  background-color: #edf0f1;
  font-weight: 500;
`;
