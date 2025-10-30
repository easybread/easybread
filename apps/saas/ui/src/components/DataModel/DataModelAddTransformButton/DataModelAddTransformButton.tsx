'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '../../../shadcn/button';
import type { DataModelNode } from '../nodes/DataModelNode';

import {
  AddTransformNodeDropdown,
  type TransformType,
} from './AddTransformNodeDropdown';

export function DataModelAddTransformButton({
  parentNodeType,
  onAdd,
}: {
  parentNodeType: DataModelNode['type'];
  onAdd: (transform: TransformType) => void;
}) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [selectedTransform, setSelectedTransform] =
    useState<TransformType | null>(null);

  const onClick = useCallback(() => {
    setDropDownOpen(prev => !prev);
  }, []);

  const onSelect = useCallback((value: TransformType) => {
    setSelectedTransform(value);
  }, []);

  const onCreate = useCallback(() => {
    if (!selectedTransform) return;
    onAdd(selectedTransform);
    setDropDownOpen(false);
    setSelectedTransform(null);
  }, [selectedTransform, onAdd]);

  const onCancel = useCallback(() => {
    setDropDownOpen(false);
    setSelectedTransform(null);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 rounded-lg
        bg-background p-1 text-muted-foreground shadow
        hover:text-secondary-foreground hover:shadow-lg"
    >
      {dropDownOpen && (
        <AddTransformNodeDropdown
          parentNodeType={parentNodeType}
          onSelect={onSelect}
        />
      )}

      {!dropDownOpen && (
        <Button onClick={onClick} size="sm" variant="link">
          <Plus size={10} />
        </Button>
      )}

      {dropDownOpen && (
        <div className="flex w-full flex-row justify-between gap-2">
          <Button onClick={onCreate} size="sm" variant={'ghost'}>
            Create
          </Button>
          <Button onClick={onCancel} size="sm" variant={'ghost'}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
