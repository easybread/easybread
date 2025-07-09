import { useEffect, useMemo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn/select';
import type { DataModelNode } from '../nodes/DataModelNode';

const transformOptions = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Map',
    value: 'transform-map',
  },
  {
    label: 'Populate',
    value: 'transform-populate',
  },
] as const;

export type TransformType = (typeof transformOptions)[number]['value'];

const defaultTransform = (parentNodeType: DataModelNode['type']) => {
  if (parentNodeType === 'entity') return 'transform-populate';
  if (parentNodeType === 'populate') return 'transform-map';
  return 'none';
};

export function AddTransformNodeDropdown({
  parentNodeType,
  onSelect,
}: {
  parentNodeType: DataModelNode['type'];
  onSelect: (transform: TransformType) => void;
}) {
  const options = useMemo(() => {
    if (parentNodeType === 'populate') {
      return transformOptions.filter(o => o.value !== 'transform-populate');
    }
    if (parentNodeType === 'map') {
      return transformOptions.filter(
        o => o.value !== 'transform-map' && o.value !== 'transform-populate',
      );
    }
    return transformOptions;
  }, [parentNodeType]);

  const defaultValue = useMemo(
    () => defaultTransform(parentNodeType),
    [parentNodeType],
  );

  useEffect(() => {
    onSelect(defaultValue);
  }, [defaultValue, onSelect]);

  return (
    <Select onValueChange={onSelect} defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>

      <SelectContent>
        {options.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
