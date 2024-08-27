import {
  BreadDataMapDefinition,
  BreadDataMapIOConstraint,
  BreadDataMapper,
} from '@easybread/data-mapper';

/**
 * Params for creating a new pagination adapter.
 *
 * @template IP internal params type
 * @template ID internal data type
 * @template EP external params type
 * @template ED external data type
 */
export interface BreadPaginationAdapterParams<
  IP extends BreadDataMapIOConstraint,
  ID extends BreadDataMapIOConstraint,
  EP extends BreadDataMapIOConstraint,
  ED extends BreadDataMapIOConstraint
> {
  /** Map definition to map from internal params to external params. */
  toExternalParams: BreadDataMapDefinition<IP, EP>;
  /** Map definition to map from external data to internal data. */
  toInternalData: BreadDataMapDefinition<ED, ID>;
}

/**
 * Pagination adapter object that maps
 * internal params to external params and
 * external data to internal data.
 *
 * @template IP internal params type
 * @template ID internal data type
 * @template EP external params type
 * @template ED external data type
 */
export type BreadPaginationAdapter<
  IP extends BreadDataMapIOConstraint,
  ID extends BreadDataMapIOConstraint,
  EP extends BreadDataMapIOConstraint,
  ED extends BreadDataMapIOConstraint
> = {
  /** Map from internal params to external params. */
  toExternalParams: (input: IP) => EP;
  /** Map from external data to internal data. */
  toInternalData: (input: ED) => ID;
};

/**
 * Create a new pagination adapter, that transforms
 * internal params to external params and
 * external data to internal data.
 * (to send out params and receive data, with transformations)
 *
 * @template ID internal data type
 * @template IP internal params type
 * @template ED external data type
 * @template EP external params type
 */
export function breadPaginationAdapter<
  IP extends BreadDataMapIOConstraint,
  ID extends BreadDataMapIOConstraint,
  EP extends BreadDataMapIOConstraint,
  ED extends BreadDataMapIOConstraint
>(
  props: BreadPaginationAdapterParams<IP, ID, EP, ED>
): BreadPaginationAdapter<IP, ID, EP, ED> {
  const { toExternalParams, toInternalData } = props;

  const toExternalParamsMapper = new BreadDataMapper<IP, EP>(toExternalParams);
  const toInternalDataMapper = new BreadDataMapper<ED, ID>(toInternalData);

  return {
    toExternalParams: (input: IP) => toExternalParamsMapper.map(input),
    toInternalData: (input: ED) => toInternalDataMapper.map(input),
  };
}
