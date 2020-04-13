import querystring from 'querystring';
import React, { FC, useEffect, useMemo } from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components/macro';

import { GoogleAuthCallbackParamsDto } from '../../../dtos';
import { useCompleteGoogleOauth2 } from './hooks';

interface OauthPageProps {}

export const CompleteGoogleOAuth2Page: FC<OauthPageProps> = () => {
  const location = useLocation();

  const params = useMemo(() => {
    const query = location.search.replace(/^\?/, '');
    return querystring.parse(query) as GoogleAuthCallbackParamsDto;
  }, [location.search]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore
  const [_, completeOauth] = useCompleteGoogleOauth2();

  useEffect(() => {
    completeOauth(params);
  }, []);

  return (
    <StyledContainer>
      <StyledLoader size={48} />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
`;

const rotate = keyframes`
  0% {
    transform: rotate(-50deg);
  }
  100% {
    transform: rotate(780deg);
  }
`;

const StyledLoader = styled(FaCircleNotch)`
  animation: 0.8s ${rotate} ease-in-out infinite alternate;
  color: var(--brand-teal-desaturated);
`;
