'use client';

import { Asterisk, Fingerprint, KeyRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';

const legendItems = [
  { Icon: KeyRound, text: 'Primary Key', color: 'text-gray-400' },
  { Icon: Asterisk, text: 'Not Nullable (Required)', color: 'text-gray-400' },
  { Icon: Fingerprint, text: 'Unique', color: 'text-gray-400' },
];

export function Legend() {
  return (
    <Card
      className="fixed right-4 bottom-4 z-20 w-auto border-gray-600 bg-gray-800 text-white
        shadow-xl"
    >
      <CardHeader className="p-3">
        <CardTitle className="text-md font-semibold text-gray-100">
          Icon Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ul className="space-y-2">
          {legendItems.map(({ Icon, text, color }) => (
            <li key={text} className="flex items-center gap-2 text-xs">
              <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
              <span className="text-gray-300">{text}</span>
            </li>
          ))}
          <li className="flex items-center gap-2 text-xs">
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              <span className="text-[10px] text-gray-500 italic">
                (no icon)
              </span>
            </div>
            <span className="text-gray-300">Nullable</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
