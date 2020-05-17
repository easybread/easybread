import querystring from 'querystring';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { GoogleAuthCallbackParamsDto } from '../../../api/api.dtos';
import { completeGoogleOAuth2 } from '../../redux/features/adapters';
import { ElementSpinner } from '../../ui-kit/element-kit';

interface OauthPageProps {}

export const CompleteGoogleOAuth2Page: FC<OauthPageProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams<{ adapter: 'google-contacts' | 'gsuite-admin' }>();

  const query = location.search.replace(/^\?/, '');
  const queryParams = querystring.parse(query) as GoogleAuthCallbackParamsDto;

  useEffect(() => {
    dispatch(completeGoogleOAuth2(params.adapter, queryParams));
  }, [dispatch, params.adapter, queryParams]);

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
