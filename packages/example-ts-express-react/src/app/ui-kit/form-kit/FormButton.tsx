import styled from 'styled-components';

import { px4, py2, w2of3 } from '../../styles/mixins';
import { BREAKPOINTS } from '../../styles/theme';

export const FormButton = styled.button`
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

  @media (min-width: ${BREAKPOINTS.sm}) {
    ${w2of3}
  }
`;
