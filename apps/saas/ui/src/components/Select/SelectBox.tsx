import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../shadcn/select';

export type SelectBoxData<T> = ({ label: string; items: T[] } | T)[];

export function SelectBox<
  T extends Record<string, unknown>,
  V extends string,
>(props: {
  data: SelectBoxData<T>;
  placeholder: string;
  value: V | undefined;
  toValue: (item: T) => V;
  toItemLabel: (item: T) => string;
  onChange: (value: V) => void;
  className?: string;
}) {
  const { onChange, data, toItemLabel, toValue, value, placeholder } = props;

  return (
    <Select onValueChange={v => onChange(v as V)} defaultValue={value}>
      <SelectTrigger className={props.className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {data.map(d => {
          if (isGroup<T>(d)) {
            return (
              <SelectGroup key={d.label}>
                <SelectLabel className="tracking-wider">{d.label}</SelectLabel>

                {d.items.map(i => (
                  <SelectItem
                    key={toValue(i)}
                    value={toValue(i)}
                    className={'pl-4 hover:bg-zinc-100'}
                  >
                    {toItemLabel(i)}
                  </SelectItem>
                ))}
              </SelectGroup>
            );
          }

          return (
            <SelectItem
              key={toValue(d)}
              value={toValue(d)}
              className={'hover:bg-zinc-100'}
            >
              {toItemLabel(d)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function isGroup<T>(v: any): v is { label: string; items: T[] } {
  return !!v && typeof v === 'object' && 'items' in v;
}
