export function moveHighlight(
  current: number,
  delta: number,
  length: number,
): number {
  if (length === 0) {
    return -1;
  }

  if (current < 0) {
    return delta > 0 ? 0 : length - 1;
  }

  return Math.min(length - 1, Math.max(0, current + delta));
}

export function firstHighlight(length: number): number {
  return length > 0 ? 0 : -1;
}

export function lastHighlight(length: number): number {
  return length > 0 ? length - 1 : -1;
}
