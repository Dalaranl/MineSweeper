import { TField, TFlagPosition } from "../components/MineSweeper.types";
import { MINE } from "../data/level";

export const isClearCheck = (
  nowField: TField,
  col: number,
  row: number,
  countOfMine: number
) => {
  let isValue = false;
  let count = 0;
  for (let y = 0; y < nowField.length; y++) {
    for (let x = 0; x < nowField[y].length; x++) {
      if (nowField[y][x].isOpen) count++;
    }
  }

  if (col * row - count === countOfMine) isValue = true;

  return isValue;
};

export const flagCheck = (
  newFlagPosition: TFlagPosition,
  field: TField,
  countOfMine: number
) => {
  let count = 0;
  for (let idx = 0; idx < newFlagPosition.length; idx++) {
    const y = newFlagPosition[idx][0],
      x = newFlagPosition[idx][1];
    if (field[y][x].value === MINE) count++;
  }
  if (count === countOfMine) return true;
  else return false;
};
