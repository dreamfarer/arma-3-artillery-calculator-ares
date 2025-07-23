import { MapMetadataRecord } from '@/types/map-metadata';

export async function loadMapMetadata(): Promise<MapMetadataRecord> {
  return fetch('/maps.json').then((r) => r.json());
}
