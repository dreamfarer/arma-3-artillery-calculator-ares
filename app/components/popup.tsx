import React from 'react';

export default function Popup({ position }: { position: [number, number] }) {
  return (
    <div>
      <pre>{JSON.stringify(position, null, 2)}</pre>
    </div>
  );
}
