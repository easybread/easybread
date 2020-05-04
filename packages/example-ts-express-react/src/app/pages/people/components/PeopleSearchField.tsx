import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';

import { ElementSpinner } from '../../../ui-kit/element-kit';
import { FormInput } from '../../../ui-kit/form-kit';

interface PersonSearchFieldProps {
  searching: boolean;
  query: string;
  search: (value: string) => void;
  throttle?: number;
}

export const PeopleSearchField: FC<PersonSearchFieldProps> = ({
  searching,
  query = '',
  search,
  throttle = 500
}) => {
  const [searchString, setSearchString] = useState<string>(query);

  const timeoutRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (!timeoutRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const onChanged = useCallback(
    (value: string) => {
      clear();
      timeoutRef.current = setTimeout(() => search(value), throttle);
      setSearchString(value);
    },
    [clear, search, throttle]
  );

  const forceSearch = useCallback(
    (value: string) => {
      clear();
      search(value);
    },
    [clear, search]
  );

  // update the inner search string when external query param changes
  useEffect(() => setSearchString(query), [query]);

  // cleanup before unmount
  useEffect(() => clear, [clear]);

  return (
    <StyledWrapper>
      <StyledSearchInput
        placeholder={'Search contacts'}
        value={searchString}
        autofocus={true}
        onChanged={onChanged}
        onEnterKey={forceSearch}
      />
      <StyledIndicatorContainer>
        {searching && <ElementSpinner />}
      </StyledIndicatorContainer>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledIndicatorContainer = styled.div`
  position: absolute;
  right: var(--gap-5);
  margin-top: 1px;
`;

const StyledSearchInput = styled(FormInput)`
  background-color: transparent;
  border-color: var(--brand-teal);
  color: var(--brand-teal-desaturated-dark);
  height: 50px;
  font-weight: 500;
  font-size: var(--text-lg);

  :disabled {
    border-color: var(--brand-teal-desaturated-light);
    color: var(--brand-teal-desaturated-light);
  }
`;
