import fs from 'fs';
import path from 'path';
import { parse } from 'fast-csv';

/**
 * Elevation binary encoder
 *
 * Layout:
 * [uint32 width][uint32 height][float32 min][float32 max][float32 spacing]
 * [uint16 height1][uint16 height2] ... in row-major order
 *
 * Example usage:
 * npm run build:encode -- input.csv 6145 6145 5
 */

type Row = { x: number; y: number; height: number };

function exitWithError(message: string): void {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseArguments() {
  const [, , filePathArg, xCountArg, yCountArg, spacingArg] = process.argv;
  if (!filePathArg || !xCountArg || !yCountArg || !spacingArg) {
    exitWithError(
      'Usage: npm run build:encode -- <file.csv> <x-count> <y-count> <spacing>'
    );
  }
  const filePath = path.resolve(filePathArg);
  const xCount = parseInt(xCountArg);
  const yCount = parseInt(yCountArg);
  const spacing = parseFloat(spacingArg);
  return { filePath, xCount, yCount, spacing };
}

async function loadHeights(filePath: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const heights: number[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on('error', reject)
      .on('data', (row: Row) => {
        const h = parseFloat(row.height as unknown as string);
        heights.push(h);
      })
      .on('end', () => resolve(heights));
  });
}

function normalizeAndQuantize(heights: number[]): {
  quantized: Uint16Array;
  min: number;
  max: number;
} {
  let min = Infinity;
  let max = -Infinity;

  for (const h of heights) {
    if (h < min) min = h;
    if (h > max) max = h;
  }

  const range = max - min || 1;
  const quantized = new Uint16Array(heights.length);

  for (let i = 0; i < heights.length; ++i) {
    const norm = (heights[i] - min) / range;
    quantized[i] = Math.round(norm * 65535);
  }

  return { quantized, min, max };
}

function buildSimpleBinary(
  x: number,
  y: number,
  quantized: Uint16Array,
  min: number,
  max: number,
  spacing: number
): Buffer {
  const headerSize = 4 + 4 + 4 + 4 + 4; // width, height, min, max, spacing
  const dataSize = quantized.byteLength;
  const buffer = Buffer.alloc(headerSize + dataSize);

  let offset = 0;
  buffer.writeUInt32LE(x, offset);
  offset += 4;
  buffer.writeUInt32LE(y, offset);
  offset += 4;
  buffer.writeFloatLE(min, offset);
  offset += 4;
  buffer.writeFloatLE(max, offset);
  offset += 4;
  buffer.writeFloatLE(spacing, offset);
  offset += 4;

  Buffer.from(quantized.buffer).copy(buffer, offset);

  return buffer;
}

async function encode() {
  const { filePath, xCount, yCount, spacing } = parseArguments();
  const heights = await loadHeights(filePath);
  if (heights.length !== xCount * yCount) {
    exitWithError(
      `CSV does not match expected size: got ${heights.length}, expected ${
        xCount * yCount
      }`
    );
  }

  const { quantized, min, max } = normalizeAndQuantize(heights);
  const buffer = buildSimpleBinary(
    xCount,
    yCount,
    quantized,
    min,
    max,
    spacing
  );
  const outPath = path.resolve('elevation.bin');
  fs.writeFileSync(outPath, buffer);
  console.log(
    `Wrote ${outPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`
  );
}

encode();
