import { Point2D } from '@/types/point-2-d';
import { getArtilleryFiringSolution } from '@/lib/artillery/get-artillery-firing-solution';
import { getArtilleryPosition } from '@/lib/map/get-artillery-position';
import { GeoJSONSource } from 'maplibre-gl';
import { Point3D } from '@/types/point-3-d';
import { TargetFeatureProperties } from '@/types/target-feature-properties';

export async function generateTargetProperties(
  map: string,
  source: GeoJSONSource,
  position: Point2D,
  elevation: number
): Promise<TargetFeatureProperties | undefined> {
  const artilleryPosition = await getArtilleryPosition(source);
  let firingSolution;
  try {
    firingSolution = getArtilleryFiringSolution(artilleryPosition, {
      ...position,
      z: elevation,
    } as Point3D);
  } catch (err) {
    console.error('Failed to calculate firing solution:', err);
    return;
  }
  return {
    id: crypto.randomUUID(),
    x: position.x,
    y: position.y,
    z: elevation,
    azimuth: firingSolution.azimuth,
    direct: firingSolution.elevation.direct,
    indirect: firingSolution.elevation.indirect,
    fireMode: firingSolution.fireMode.name,
    map,
    markerType: 'target',
  };
}
