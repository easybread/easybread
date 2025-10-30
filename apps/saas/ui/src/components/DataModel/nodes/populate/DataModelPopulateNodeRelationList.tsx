import { Fragment } from 'react/jsx-runtime';

import { RELATION_MULTIPLICITY } from '@easybread/data-model';

import { Checkbox } from '../../../../shadcn/checkbox';
import { Label } from '../../../../shadcn/label';
import { makeEntityLabel } from '../../utils';

import type { RelationToPopulate } from './types';

export function DataModelPopulateNodeRelationsList({
  availableRelations,
  selectedRelations,
  setSelectedState,
}: {
  availableRelations: RelationToPopulate[];
  selectedRelations: Record<string, boolean>;
  setSelectedState: (relationId: string, state: boolean) => void;
}) {
  const onLabelClick = (
    event: React.MouseEvent<HTMLLabelElement>,
    relationId: string,
  ) => {
    event.stopPropagation();
    setSelectedState(relationId, !selectedRelations[relationId]);
  };

  return (
    <div
      className="flex flex-col divide-y border-t border-muted-foreground/10
        bg-muted text-xs text-secondary-foreground"
    >
      {availableRelations.map(r => (
        <Fragment key={r.id}>
          <Label
            key={r.id}
            htmlFor={r.id}
            onClick={event => onLabelClick(event, r.id)}
            className="flex cursor-pointer items-center justify-between gap-2
              px-4 py-1 hover:bg-muted/50"
          >
            <Checkbox
              id={r.id}
              name={r.id}
              className="cursor-pointer"
              checked={selectedRelations[r.id] || false}
              onCheckedChange={state => setSelectedState(r.id, !!state)}
            />

            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="flex grow-1 flex-col">
                <span
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  {makeEntityLabel(r.relatedEntity)}
                  <MultiplicityBadge mul={r.relation[r.relationType].mul} />
                </span>
                <span className="text-xs text-muted-foreground">
                  {r.relation.id}
                </span>
              </div>
            </div>
          </Label>

          {r.subRelations.length > 0 && (
            <div className="ml-2 border-l border-muted-foreground/10">
              <DataModelPopulateNodeRelationsList
                availableRelations={r.subRelations}
                selectedRelations={selectedRelations}
                setSelectedState={setSelectedState}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

function MultiplicityBadge({
  mul: multiplicity,
}: {
  mul: typeof RELATION_MULTIPLICITY.$type;
}) {
  if (multiplicity === RELATION_MULTIPLICITY.enum.ONE) {
    return <span className="text-xs text-muted-foreground">1</span>;
  }

  if (multiplicity === RELATION_MULTIPLICITY.enum.MANY) {
    return <span className="text-xs text-muted-foreground">*</span>;
  }
}
