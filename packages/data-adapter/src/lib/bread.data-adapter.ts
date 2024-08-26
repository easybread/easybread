import {
  BreadDataMapDefinition,
  BreadDataMapIOConstraint,
  BreadDataMapper,
} from '@easybread/data-mapper';

/**
 * @template I Internal type
 * @template E External type
 */
interface BreadDataAdapterProps<
  I extends BreadDataMapIOConstraint,
  E extends BreadDataMapIOConstraint
> {
  /** Map definition to map from internal to external type. */
  toExternal: BreadDataMapDefinition<I, E>;
  /** Map definition to map from external to internal type. */
  toInternal: BreadDataMapDefinition<E, I>;
}

/**
 * Data adapter object that maps from and to internal and external types.
 *
 * @template I Internal type
 * @template E External type
 */
export type BreadDataAdapter<
  I extends BreadDataMapIOConstraint,
  E extends BreadDataMapIOConstraint
> = {
  toExternal(input: I): E;
  toInternal(input: E): I;
};

/**
 * Creates a new data adapter that maps from and to internal and external types.
 *
 * @template I Internal type
 * @template E External type
 */
export function breadDataAdapter<
  I extends BreadDataMapIOConstraint,
  E extends BreadDataMapIOConstraint
>(props: BreadDataAdapterProps<I, E>): BreadDataAdapter<I, E> {
  const { toExternal, toInternal } = props;

  const toExternalMapper = new BreadDataMapper<I, E>(toExternal);
  const toInternalMapper = new BreadDataMapper<E, I>(toInternal);

  return {
    toExternal: (input: I) => toExternalMapper.map(input),
    toInternal: (input: E) => toInternalMapper.map(input),
  };
}
