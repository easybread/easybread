import querystring from 'querystring';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import { GoogleAuthCallbackParamsDto } from '../../../api/api.dtos';
import { completeGoogleOAuth2 } from '../../redux/features/adapters';
import { ElementSpinner } from '../../ui-kit/element-kit';

interface OauthPageProps {}

export const CompleteGoogleOAuth2Page: FC<OauthPageProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const query = location.search.replace(/^\?/, '');
  const params = querystring.parse(query) as GoogleAuthCallbackParamsDto;

  useEffect(() => {
    dispatch(completeGoogleOAuth2(params));
  }, [dispatch, params]);

  return (
    <StyledContainer>
      <ElementSpinner size={48} />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
`;
