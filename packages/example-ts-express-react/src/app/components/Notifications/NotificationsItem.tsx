import React, { FC } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components/macro';

import {
  AppNotification,
  notificationsActions,
  NotificationType
} from '../../redux/features/notifications';

interface NotoficationsItemProps {
  notification: AppNotification;
}

export const NotificationItem: FC<NotoficationsItemProps> = ({
  notification
}) => {
  const { message, title, type } = notification;
  const dispatch = useDispatch();

  const close = (): void => {
    dispatch(notificationsActions.removeNotification(notification));
  };

  return (
    <StyledWrapper notyType={type}>
      <StyledTitleRow>
        <strong>{title}</strong>
        <StyledCloseButton onClick={close} />
      </StyledTitleRow>
      <StyledMessageRow>
        <p>{message}</p>
      </StyledMessageRow>
    </StyledWrapper>
  );
};

interface WrapperProps {
  notyType: NotificationType;
}

const ErrorWrapperCSS = css`
  --color: #be6353;
  border-color: var(--color);
  color: var(--color);
  background-color: #fdf2f0;
`;
const SuccessWrapperCSS = css`
  --color: #42a64c;
  border-color: var(--color);
  color: var(--color);
  background-color: #f0fdf8;
`;

const StyledWrapper = styled.div<WrapperProps>`
  border: 2px solid;
  padding: var(--gap-2);
  padding-bottom: calc(var(--gap-2) - 3px);
  display: flex;
  flex-direction: column;
  margin-bottom: var(--gap-2);

  &:last-of-type {
    margin-bottom: 0;
  }

  ${p => p.notyType === NotificationType.ERROR && ErrorWrapperCSS}
  ${p => p.notyType === NotificationType.SUCCESS && SuccessWrapperCSS}
`;

const StyledTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: var(--text-sm);
  font-weight: 600;
`;

const StyledMessageRow = styled.div`
  display: flex;
  font-size: var(--text-xs);
  margin-top: var(--gap-1);
`;

const StyledCloseButton = styled(FaTimes)`
  cursor: pointer;
  opacity: 0.7;
  flex-shrink: 0;
  margin-top: 3px;

  &:hover {
    opacity: 1;
  }
`;
