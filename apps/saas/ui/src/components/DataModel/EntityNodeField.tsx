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

const FIELD_ROW_CONTENT_HEIGHT = 20;
const FIELD_ROW_VERTICAL_PADDING = 6 * 2;
const FIELD_ROW_BORDER_HEIGHT = 1;
const EFFECTIVE_FIELD_ROW_HEIGHT =
  FIELD_ROW_CONTENT_HEIGHT +
  FIELD_ROW_VERTICAL_PADDING +
  FIELD_ROW_BORDER_HEIGHT;

interface EntityNodeFieldProps {
  fieldName: string;
  fieldDef: ValueDef;
}

export function EntityNodeField({ fieldName, fieldDef }: EntityNodeFieldProps) {
  return (
    <li
      className="flex items-center px-2.5 py-1.5 text-xs"
      style={{
        height: `${EFFECTIVE_FIELD_ROW_HEIGHT - FIELD_ROW_BORDER_HEIGHT}px`,
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="mr-2 flex items-center gap-1.5 truncate">
          <span
            className="truncate font-medium text-gray-200"
            title={fieldName}
          >
            {fieldName}
          </span>
          {fieldDef.pk && (
            <KeyRound className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          )}
          {!fieldDef.nullable && (
            <Asterisk className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          )}
          {fieldDef.unique && (
            <Fingerprint className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          )}
        </div>
        <span className="flex-shrink-0 font-mono text-[11px] whitespace-nowrap text-gray-400">
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
