import { useCallback } from 'react';

const BIN_URL = '/elevation/altis/v1/elevation.bin';
const HEADER_SIZE = 4 + 4 + 4 + 4 + 4; // width, height, min, max, spacing = 20 bytes
const CELL_SIZE = 2; // uint16

export function useElevation() {
  const getElevation = useCallback(
    async (worldX: number, worldY: number): Promise<number | null> => {
      const headerResp = await fetch(BIN_URL, {
        headers: { Range: `bytes=0-${HEADER_SIZE - 1}` },
      });

      if (!headerResp.ok || !headerResp.body) {
        console.error('Failed to fetch header');
        return null;
      }

      const headerBuffer = await headerResp.arrayBuffer();
      const headerView = new DataView(headerBuffer);

      const xCount = headerView.getUint32(0, true);
      const yCount = headerView.getUint32(4, true);
      const min = headerView.getFloat32(8, true);
      const max = headerView.getFloat32(12, true);
      const spacing = headerView.getFloat32(16, true);

      const gridX = Math.floor(worldX / spacing);
      const gridY = Math.floor(worldY / spacing);

      if (gridX < 0 || gridX >= xCount || gridY < 0 || gridY >= yCount) {
        console.warn(`Coordinates (${gridX}, ${gridY}) out of bounds`);
        return null;
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
        return null;
      }

      const valueBuffer = await valueResp.arrayBuffer();
      const quantized = new DataView(valueBuffer).getUint16(0, true);
      const norm = quantized / 65535;
      const elevation = min + norm * (max - min);

      return elevation;
    },
    []
  );

  return getElevation;
}
