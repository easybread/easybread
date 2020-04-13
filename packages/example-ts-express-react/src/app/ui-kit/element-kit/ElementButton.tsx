import styled from 'styled-components/macro';

import { px4, py2 } from '../../styles/mixins';

export const ElementButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 2px solid var(--brand-teal);
  color: var(--brand-teal);
  font-weight: 600;
  height: 2.5rem;
  cursor: pointer;
  ${py2}
  ${px4}
  
  :hover {
    color: var(--white);
    background-color: var(--brand-teal);
  }

  &[disabled] {
    border-color: var(--disabled-border-color);
    color: var(--disabled-text-color);
    background-color: transparent;
    cursor: auto;
  }
`;
