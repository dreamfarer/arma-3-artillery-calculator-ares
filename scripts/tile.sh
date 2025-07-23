#!/bin/sh
# Usage: sh tile.sh <source-image>

set -eu

if [ $# -ne 1 ]; then
  echo "Usage: $0 <source-image.png>"
  exit 1
fi

SRC="$1"
SRC_RGBA="source-with-alpha.png"
OUT_PADDED="padded-map.png"
TILE_DIR="tiles"

# Step 1: Add alpha channel to input image (makes it RGBA with full opacity)
vips bandjoin_const "$SRC" "$SRC_RGBA" 255
SRC="$SRC_RGBA"

# Step 2: Get original image size
W=$(vipsheader -f width "$SRC")
H=$(vipsheader -f height "$SRC")

# Step 3: Determine grid size (next power of 2 tile grid * 256, +1 step)
if [ "$W" -gt "$H" ]; then
  MAX_EDGE=$W
else
  MAX_EDGE=$H
fi

GRID=256
while [ "$GRID" -le "$MAX_EDGE" ]; do
  GRID=$(expr "$GRID" \* 2)
done
GRID=$(expr "$GRID" \* 2)  # one extra level for padding

# Step 4: Compute offsets to center image
OFFX=$(expr \( "$GRID" - "$W" \) / 2)
OFFY=$(expr \( "$GRID" - "$H" \) / 2)

echo "Configuration for 'public/maps.json':"
echo "'tileSize': 256"
echo "'size': [${GRID}, ${GRID}]"
echo "'boundsImage': [${OFFX}, ${OFFY}, $(expr "$OFFX" + "$W"), $(expr "$OFFY" + "$H")]"

# Step 5: Embed image in transparent canvas
vips embed "$SRC" "$OUT_PADDED" \
  "$OFFX" "$OFFY" "$GRID" "$GRID" \
  --background 0

# Step 6: Tile it using dzsave (skip transparent tiles)
vips dzsave "$OUT_PADDED" "$TILE_DIR" \
  --layout google \
  --suffix .png \
  --tile-size 256 \
  --overlap 0 \
  --background 0 \
  --skip-blanks 0

echo "Done!"
