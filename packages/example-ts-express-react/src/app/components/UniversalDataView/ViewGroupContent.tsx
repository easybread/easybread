import { map } from 'lodash';
import React, { FC } from 'react';
import styled, { css } from 'styled-components/macro';

import { ValueView } from './ValueView';
import { Viewable } from './Viewable';

interface ObjectViewContentProps {
  value: object | Viewable[];
  indent?: boolean;
}

export const ViewGroupContent: FC<ObjectViewContentProps> = ({
  value,
  indent = false
}) => {
  return (
    <StyledWrapper indent={indent}>
      {map(value, (propValue, propName) => (
        <ValueView name={`${propName}`} value={propValue} key={propName} />
      ))}
    </StyledWrapper>
  );
};

const indentedCSS = css`
  //padding-top: 10px;
  padding-left: 10px;
  border-left: 1px solid #efefef;
  background-color: rgba(255, 255, 255, 0.6);
`;

const StyledWrapper = styled.div<{ indent: boolean }>`
  display: flex;
  flex-direction: column;

  ${p => p.indent && indentedCSS}
`;
