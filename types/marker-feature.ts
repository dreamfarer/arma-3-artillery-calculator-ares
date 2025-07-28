import { Feature, Point } from 'geojson';

export type TMarkerType = 'artillery' | 'target';

export type TMarkerFeature = Feature<
  Point,
  {
    id: string;
    x: number;
    y: number;
    map: string;
    markerType: TMarkerType;
  }
>;
