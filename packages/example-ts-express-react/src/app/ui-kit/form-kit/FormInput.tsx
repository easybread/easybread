import React, {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef
} from 'react';
import styled from 'styled-components/macro';

interface FormInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  autofocus?: boolean;
  onChanged: (value: string) => void;
  onEnterKey?: (value: string) => void;
}

export const FormInput: FC<FormInputProps> = ({
  autofocus = false,
  onChanged,
  onEnterKey,
  ...restProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus && inputRef.current) inputRef.current.focus();
  }, [autofocus]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => onChanged(e.target.value),
    [onChanged]
  );

  const onKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key.toLowerCase() === 'enter') {
        onEnterKey && onEnterKey(inputRef.current?.value || '');
      }
    },
    [onEnterKey]
  );

  return (
    <StyledInput
      {...restProps}
      ref={inputRef}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  );
};

const StyledInput = styled.input`
  width: 100%;

  @media (min-width: 640px) {
    flex: 2;
  }
`;
