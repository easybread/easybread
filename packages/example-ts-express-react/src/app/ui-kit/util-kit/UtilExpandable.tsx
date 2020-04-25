import { noop } from 'lodash';
import React, { FC, useState } from 'react';

interface WithExpanded {
  expanded?: boolean;
}

interface WithOnClickCallback {
  onClick?: () => void;
}

interface WithCloseCallback {
  close: () => void;
}

export type UtilExpandableToggleProps = WithExpanded & WithOnClickCallback;
export type UtilExpandableContentProps = WithExpanded & WithCloseCallback;

interface UtilExpandableProps {
  renderToggle: FC<UtilExpandableToggleProps>;
  renderContent: FC<UtilExpandableContentProps>;
  onCollapse?: () => void;
  onExpand?: () => void;
  startExpanded?: boolean;
}

export const UtilExpandable: FC<UtilExpandableProps> = ({
  renderToggle,
  renderContent,
  startExpanded = false,
  onExpand = noop,
  onCollapse = noop
}) => {
  const [expanded, setExpanded] = useState(startExpanded);

  const toggle = (): void => {
    setExpanded(!expanded);
    expanded ? onCollapse() : onExpand();
  };

  const close = (): void => {
    setExpanded(false);
    onCollapse();
  };

  return (
    <>
      {renderToggle({ expanded, onClick: toggle })}
      {renderContent({ expanded, close })}
    </>
  );
};
