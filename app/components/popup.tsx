import React from 'react';
import { ArtilleryFiringSolution } from '@/types/artillery-firing-solution';

export default function Popup({
  firingSolution,
}: Readonly<{ firingSolution: ArtilleryFiringSolution }>) {
  return (
    <div>
      <p>azimuth: {firingSolution.azimuth}°</p>
      <p>direct: {firingSolution.elevation.direct}°</p>
      <p>indirect: {firingSolution.elevation.indirect}°</p>
    </div>
  );
}
