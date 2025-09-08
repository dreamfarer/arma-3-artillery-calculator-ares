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

export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}
