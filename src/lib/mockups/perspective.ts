/**
 * CSS `matrix3d` for a projective (4-corner) map — used to warp a screenshot
 * into a mockup photo's tilted screen. Given the source element's box (w×h in
 * px) and 4 destination corners in px, returns a `transform` string that maps
 * the box corners exactly onto the destination quad.
 *
 * Standard general-2D-projection solve (map basis → 4 points for both source
 * and dest, then compose). Corner order is TL, TR, BR, BL for both.
 */

type Mat3 = number[]; // row-major 3×3

function adj(m: Mat3): Mat3 {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
}

function multmm(a: Mat3, b: Mat3): Mat3 {
  const r: Mat3 = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j];
      r[3 * i + j] = s;
    }
  return r;
}

function multmv(m: Mat3, v: number[]): number[] {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

function basisToPoints(p: number[]): Mat3 {
  // p = [x1,y1, x2,y2, x3,y3, x4,y4]
  const m: Mat3 = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1];
  const v = multmv(adj(m), [p[6], p[7], 1]);
  return multmm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

/** dst corners are [TL, TR, BR, BL] in px; box is w×h in px. */
export function matrix3dForQuad(
  w: number,
  h: number,
  dst: [number, number][],
): string {
  const src = basisToPoints([0, 0, w, 0, w, h, 0, h]);
  const dest = basisToPoints([
    dst[0][0],
    dst[0][1],
    dst[1][0],
    dst[1][1],
    dst[2][0],
    dst[2][1],
    dst[3][0],
    dst[3][1],
  ]);
  const t = multmm(dest, adj(src));
  for (let i = 0; i < 9; i++) t[i] = t[i] / t[8];
  const m = [
    t[0], t[3], 0, t[6],
    t[1], t[4], 0, t[7],
    0, 0, 1, 0,
    t[2], t[5], 0, t[8],
  ];
  return `matrix3d(${m.join(",")})`;
}
