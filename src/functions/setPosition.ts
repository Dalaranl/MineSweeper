import { SEARCH_POSITION } from "../data/level";

export const setPosition = (
  y: number,
  x: number,
  index: number,
  col: number,
  row: number
) => {
  const nowY = y + SEARCH_POSITION[index].y;
  const nowX = x + SEARCH_POSITION[index].x;

  if (nowY === -1 || nowY === col) return false;
  if (nowX === -1 || nowX === row) return false;

  return { nowY, nowX };
};
