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

export function AddTransformNodeDropdown({
  parentNodeType,
  onSelect,
}: {
  parentNodeType: DataModelNode['type'];
  onSelect: (transform: TransformType) => void;
}) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>

      <SelectContent>
        {transformOptions
          .filter(o => {
            if (parentNodeType === 'populate') {
              return o.value !== 'transform-populate';
            }
            if (parentNodeType === 'map') {
              return false;
            }
            return true;
          })
          .map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
