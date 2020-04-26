import React, { FC } from 'react';
import styled from 'styled-components/macro';

import { useNotificationsArray } from '../../redux/features/notifications';
import { NotificationItem } from './NotificationsItem';

interface NotificationsProps {}

export const Notifications: FC<NotificationsProps> = () => {
  const notificationsArray = useNotificationsArray();

  if (!notificationsArray.length) return null;

  return (
    <StyledWrapper>
      {notificationsArray.map((n, i) => (
        <NotificationItem notification={n} key={i} />
      ))}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  right: var(--gap-10);
  bottom: var(--gap-10);
  width: 350px;
  opacity: 0.5;
  padding: 5px 10px;

  &:hover {
    opacity: 0.8;
  }
`;
