import sharp from "sharp";

/**
 * Perceptual difference-hash (dHash). Unlike a byte-content hash, this is
 * stable across the re-encoding noise Google's Places API photo endpoint
 * introduces: fetching the "same" photo on different days yields different
 * JPEG bytes, but the same 9x8 downsampled gradient pattern.
 */
export async function perceptualHash(buffer: Buffer): Promise<string> {
  const { data } = await sharp(buffer)
    .resize(9, 8, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let bits = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left = data[row * 9 + col];
      const right = data[row * 9 + col + 1];
      bits += left > right ? "1" : "0";
    }
  }

  let hex = "";
  for (let i = 0; i < bits.length; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}

export function hammingDistance(hexA: string, hexB: string): number {
  let distance = 0;
  for (let i = 0; i < hexA.length; i++) {
    let bits = parseInt(hexA[i], 16) ^ parseInt(hexB[i], 16);
    while (bits) {
      distance += bits & 1;
      bits >>= 1;
    }
  }
  return distance;
}

// Same underlying photo re-encoded by Google typically lands at a
// dHash distance of 0-2 out of 64 bits. Distinct photos of the same
// yard/job land well above 10. 8 gives headroom without risking merges.
export const DUPLICATE_THRESHOLD = 8;
