'use client';

// Updated path
import { Asterisk, Fingerprint, KeyRound } from 'lucide-react';

import type { ValueDef } from '@easybread/data-model';

const getFieldExtras = (field: ValueDef): string => {
  let extras = '';

  switch (field.type) {
    case 'ENUM':
      extras = `(${field.enumName}${field.namespace ? `.${field.namespace}` : ''})`;
      break;

    case 'UUID':
      extras =
        field.algorithm && typeof field.algorithm === 'string'
          ? `(${field.algorithm.replace('UUID_', '')})`
          : '(uuid)';
      break;

    case 'NUMBER_ID':
      extras =
        field.algorithm && typeof field.algorithm === 'string'
          ? `(${field.algorithm.slice(0, 3)})`
          : '(id)';
      break;
    default:
      extras = '';
  }
  return extras.toLowerCase();
};

interface DataModelEntityNodeFieldProps {
  fieldName: string;
  fieldDef: ValueDef;
}

export function DataModelEntityNodeField({
  fieldName,
  fieldDef,
}: DataModelEntityNodeFieldProps) {
  return (
    <li className="flex items-center px-4 py-2 text-xs text-muted-foreground">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate" title={fieldName}>
            {fieldName}
          </span>
          {fieldDef.pk && (
            <KeyRound size={12} className="text-muted-foreground/50" />
          )}
          {!fieldDef.nullable && (
            <Asterisk size={12} className="text-muted-foreground/50" />
          )}
          {fieldDef.unique && (
            <Fingerprint size={12} className="text-muted-foreground/50" />
          )}
        </div>

        <span
          className="flex-shrink-0 font-mono text-[11px] whitespace-nowrap
            text-gray-400"
        >
          {(
            fieldDef.type.toLowerCase() +
            ' ' +
            getFieldExtras(fieldDef)
          ).trim()}
        </span>
      </div>
    </li>
  );
}
