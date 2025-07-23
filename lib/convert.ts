import { MapMetadata } from '@/types/map-metadata';

export function convertToLngLat(
  map: MapMetadata,
  x: number,
  y: number
): [number, number] {
  const [imgW, imgH] = map.size;
  const [bx0, by0, bx1, by1] = map.boundsImage;
  const [dx0, dy0, dx1, dy1] = map.boundsData;

  const rx = (x - dx0) / (dx1 - dx0);
  const ry = (y - dy0) / (dy1 - dy0);
  const px = bx0 + rx * (bx1 - bx0);
  const py = by0 + ry * (by1 - by0);

  const lon = (px / imgW) * 360 - 180;
  const mercY = 1 - 2 * (py / imgH);
  const lat = (Math.atan(Math.sinh(Math.PI * mercY)) * 180) / Math.PI;

  return [lon, lat];
}

export function convertToUnit(
  map: MapMetadata,
  lon: number,
  lat: number
): [number, number] {
  const [imgW, imgH] = map.size;
  const [bx0, by0, bx1, by1] = map.boundsImage;
  const [dx0, dy0, dx1, dy1] = map.boundsData;

  const px = ((lon + 180) / 360) * imgW;
  const mercY = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  const py = ((1 - mercY / Math.PI) / 2) * imgH;

  const rx = (px - bx0) / (bx1 - bx0);
  const ry = (py - by0) / (by1 - by0);

  const x = dx0 + rx * (dx1 - dx0);
  const y = dy0 + ry * (dy1 - dy0);

  return [x, y];
}

export function getMapBoundsLatLng(
  map: MapMetadata
): [number, number, number, number] {
  const topLeft = convertToLngLat(map, map.boundsData[0], map.boundsData[1]);
  const bottomRight = convertToLngLat(
    map,
    map.boundsData[2],
    map.boundsData[3]
  );
  const west = topLeft[0];
  const north = topLeft[1];
  const east = bottomRight[0];
  const south = bottomRight[1];
  return [west, south, east, north];
}

export function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function pxToRem(px: number): number {
  return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function vhToPx(vh: number): number {
  return (window.innerHeight * vh) / 100;
}

export function vwToPx(vw: number): number {
  return (window.innerWidth * vw) / 100;
}

export function pxToVh(px: number): number {
  return (px / window.innerHeight) * 100;
}

export function pxToVw(px: number): number {
  return (px / window.innerWidth) * 100;
}
