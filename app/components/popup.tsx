import React from 'react';
import { Point } from '@/types/point';

export default function Popup({ position }: Readonly<{ position: Point }>) {
  return (
    <div>
      <pre>{JSON.stringify(position, null, 2)}</pre>
    </div>
  );
}
