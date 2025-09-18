import { Point2D } from '@/types/point-2-d';
import { ArtilleryFeatureProperties } from '@/types/artillery-feature-properties';

export function generateArtilleryProperties(
  map: string,
  position: Point2D,
  elevation: number
): ArtilleryFeatureProperties {
  return {
    id: crypto.randomUUID(),
    x: position.x,
    y: position.y,
    z: elevation,
    map,
    markerType: 'artillery',
  };
}
