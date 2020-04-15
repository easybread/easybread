import styled from 'styled-components/macro';

interface ListItemContainerProps {
  color: string;
}

export const ListItemContainer = styled.div<ListItemContainerProps>`
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 1rem;
  position: relative;
  border-left: 8px solid ${p => p.color};
  background-color: var(--white);
  margin-bottom: var(--gap-8);
  color: var(--text-main-color-mid);
`;
