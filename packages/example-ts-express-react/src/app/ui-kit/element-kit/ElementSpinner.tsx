import { FaCircleNotch } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components/macro';

const rotate = keyframes`
  0% {
    transform: rotate(-50deg);
  }
  100% {
    transform: rotate(780deg);
  }
`;

export const ElementSpinner = styled(FaCircleNotch)`
  animation: 0.8s ${rotate} ease-in-out infinite alternate;
  color: var(--brand-teal-desaturated);
`;
