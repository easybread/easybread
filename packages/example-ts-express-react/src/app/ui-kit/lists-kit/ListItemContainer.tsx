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
  cursor: pointer;
  border-left: 8px solid ${p => p.color};
  background-color: var(--white);
  margin-bottom: var(--gap-8);
  color: var(--text-main-color-mid);

  :hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;
