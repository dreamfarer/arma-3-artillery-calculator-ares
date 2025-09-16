import React from 'react';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';
import { TargetFeatureProperties } from '@/types/target-feature-properties';

type PopupProps = {
  properties: ArtilleryFeatureProperties | TargetFeatureProperties;
};

export default function Popup({ properties }: Readonly<PopupProps>) {
  if (properties.markerType === 'target') {
    const { azimuth, direct, indirect, fireMode } = properties;
    return (
      <div>
        <p>azimuth: {azimuth}°</p>
        <p>direct: {direct}°</p>
        <p>indirect: {indirect}°</p>
        <p>fire mode: {fireMode}</p>
      </div>
    );
  }
  return (
    <div>
      <p>artillery unit</p>
    </div>
  );
}
