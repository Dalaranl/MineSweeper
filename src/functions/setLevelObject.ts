import { TMinesweeperState } from "../components/MineSweeper.types";
import { level } from "../data/level";
import { createField } from "./createField";

export const setLevelObject = (setLevel: string, restart: boolean) => {
  let setting: TMinesweeperState;
  //   const nextState: TMinesweeperState = {
  //     isStart,
  //     level: level[setLevel].name,
  //     col: level[setLevel].col,
  //     row: level[setLevel].row,
  //     countOfMine: level[setLevel].countOfMine,
  //     mineLeft: level[setLevel].countOfMine,
  //     field: createField(level[setLevel].col, level[setLevel].row),
  //   };

  if (setLevel === level.beginner.name) setting = setBeginner(restart);
  else if (setLevel === level.intermediate.name)
    setting = setIntermediate(restart);
  else setting = setExpert(restart);
  return setting;
};

const setBeginner = (restart: boolean) => {
  const setting = {
    isStart: false,
    restart: !restart,
    level: level.beginner.name,
    col: level.beginner.col,
    row: level.beginner.row,
    countOfMine: level.beginner.countOfMine,
    mineLeft: level.beginner.countOfMine,
    field: createField(level.beginner.col, level.beginner.row),
  };

  return setting;
};

const setIntermediate = (restart: boolean) => {
  const setting = {
    isStart: false,
    restart: !restart,
    level: level.intermediate.name,
    col: level.intermediate.col,
    row: level.intermediate.row,
    countOfMine: level.intermediate.countOfMine,
    mineLeft: level.intermediate.countOfMine,
    field: createField(level.intermediate.col, level.intermediate.row),
  };

  return setting;
};

const setExpert = (restart: boolean) => {
  const setting = {
    isStart: false,
    restart: !restart,
    level: level.expert.name,
    col: level.expert.col,
    row: level.expert.row,
    countOfMine: level.expert.countOfMine,
    mineLeft: level.expert.countOfMine,
    field: createField(level.expert.col, level.expert.row),
  };

  return setting;
};

export const setCustomObject = (
  col: number,
  row: number,
  countOfMine: number,
  restart: boolean
) => {
  const setting = {
    isStart: false,
    restart: !restart,
    level: level.custom.name,
    col,
    row,
    countOfMine,
    mineLeft: countOfMine,
    field: createField(col, row),
  };

  return setting;
};
