import {
  IPropsMineSweeper,
  TField,
  TFlagPosition,
} from "../components/MineSweeper.types";
import { MINE, SEARCH_POSITION } from "../data/level";
import { minusFlagPosition } from "./flagFunc";
import { getRandomNumber } from "./getRandomNumber";
import { setPosition } from "./setPosition";

// setMines
export const setMines = (
  y: number,
  x: number,
  newField: TField,
  props: IPropsMineSweeper
): TField => {
  let count = 0;
  const currentArr = [];

  for (let i = 0; i < SEARCH_POSITION.length; i++) {
    const result = setPosition(y, x, i, props.col, props.row);

    if (result) {
      currentArr.push({ currentY: result.nowY, currentX: result.nowX });
    }
  }

  while (count < props.countOfMine) {
    let isCurrent = false;
    const x = getRandomNumber(props.row);
    const y = getRandomNumber(props.col);

    for (let i = 0; i < currentArr.length; i++) {
      if (currentArr[i].currentY === y && currentArr[i].currentX === x)
        isCurrent = true;
    }

    if (
      newField[y][x].value !== MINE &&
      newField[y][x].isOpen === false &&
      !isCurrent
    ) {
      newField[y][x] = { value: MINE, isOpen: false, isFlag: false };
      count++;
    }
  }

  return newField;
};

// setFieldValue
const countMine = (
  y: number,
  x: number,
  field: TField,
  col: number,
  row: number
): TField => {
  const newField = field;

  if (newField[y][x].value === MINE) return newField;

  let count = 0;

  for (let i = 0; i < SEARCH_POSITION.length; i++) {
    const result = setPosition(y, x, i, col, row);

    if (result && newField[result.nowY][result.nowX].value === MINE) count++;
  }

  newField[y][x] = {
    value: String(count),
    isOpen: newField[y][x].isOpen,
    isFlag: false,
  };

  return newField;
};

export const setFieldValue = (
  field: TField,
  col: number,
  row: number
): TField => {
  let newField = field;
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      newField = countMine(y, x, newField, col, row);
    }
  }
  return newField;
};

// searchCurrentTile
export const searchCurrentTile = (
  y: number,
  x: number,
  newField: TField,
  props: IPropsMineSweeper,
  flagPosition: TFlagPosition
): { nowField: TField; newFlagPosition: TFlagPosition } => {
  const nowField = newField;
  let newFlagPosition = flagPosition;

  for (let i = 0; i < SEARCH_POSITION.length; i++) {
    const result = setPosition(y, x, i, props.col, props.row);

    if (result && nowField[result.nowY][result.nowX].value !== "0") {
      if (nowField[result.nowY][result.nowX].isFlag) {
        newFlagPosition = minusFlagPosition(
          result.nowY,
          result.nowX,
          flagPosition
        );
        props.addMineLeft();
      }
      nowField[result.nowY][result.nowX] = {
        value: nowField[result.nowY][result.nowX].value,
        isOpen: true,
        isFlag: false,
      };
    } else if (
      result &&
      nowField[result.nowY][result.nowX].value === "0" &&
      !nowField[result.nowY][result.nowX].isOpen
    ) {
      if (nowField[result.nowY][result.nowX].isFlag) {
        newFlagPosition = minusFlagPosition(
          result.nowY,
          result.nowX,
          flagPosition
        );
        props.addMineLeft();
      }
      nowField[result.nowY][result.nowX] = {
        value: nowField[result.nowY][result.nowX].value,
        isOpen: true,
        isFlag: false,
      };
      searchCurrentTile(
        result.nowY,
        result.nowX,
        nowField,
        props,
        flagPosition
      );
    }
  }

  return { nowField, newFlagPosition };
};
