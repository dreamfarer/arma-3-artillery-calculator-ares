import { useCallback } from 'react';
import { Point2D } from '@/types/point-2-d';

const BIN_URL = '/elevation/altis/v1/elevation.bin';
const HEADER_SIZE = 4 + 4 + 4 + 4 + 4; // width, height, min, max, spacing = 20 bytes
const CELL_SIZE = 2; // uint16

export function useElevation() {
  return useCallback(async (point2d: Point2D): Promise<number> => {
    const headerResp = await fetch(BIN_URL, {
      headers: { Range: `bytes=0-${HEADER_SIZE - 1}` },
    });

    if (!headerResp.ok || !headerResp.body) {
      console.error('Failed to fetch header');
    }

    const headerBuffer = await headerResp.arrayBuffer();
    const headerView = new DataView(headerBuffer);

    const xCount = headerView.getUint32(0, true);
    const yCount = headerView.getUint32(4, true);
    const min = headerView.getFloat32(8, true);
    const max = headerView.getFloat32(12, true);
    const spacing = headerView.getFloat32(16, true);

    const gridX = Math.floor(point2d.x / spacing);
    const gridY = Math.floor(point2d.y / spacing);

    if (gridX < 0 || gridX >= xCount || gridY < 0 || gridY >= yCount) {
      console.error(`Coordinates (${gridX}, ${gridY}) out of bounds`);
    }

    const index = gridY * xCount + gridX;
    const byteOffset = HEADER_SIZE + index * CELL_SIZE;

    const valueResp = await fetch(BIN_URL, {
      headers: {
        Range: `bytes=${byteOffset}-${byteOffset + CELL_SIZE - 1}`,
      },
    });

    if (!valueResp.ok || !valueResp.body) {
      console.error('Failed to fetch elevation data');
    }

    const valueBuffer = await valueResp.arrayBuffer();
    const quantized = new DataView(valueBuffer).getUint16(0, true);
    const norm = quantized / 65535;
    return min + norm * (max - min);
  }, []);
}
