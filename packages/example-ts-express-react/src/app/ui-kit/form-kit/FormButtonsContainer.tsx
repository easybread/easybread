import styled from 'styled-components/macro';

import { BREAKPOINTS } from '../../styles/theme';

export const FormButtonsContainer = styled.div`
  display: flex;
  background-color: #fff;
  padding-bottom: 1.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  button {
    width: 100%;
  }

  @media (min-width: ${BREAKPOINTS.sm}) {
    .spacer {
      width: 33.333333%;
    }

    button {
      width: 66.666667%;
    }
  }
`;
