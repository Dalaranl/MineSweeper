import {
  IPropsMineSweeper,
  TField,
  TFlagPosition,
} from "../components/MineSweeper.types";

export const resetFlag = (
  nowField: TField,
  props: IPropsMineSweeper
): TField => {
  const newField = nowField;
  for (let i = 0; i < newField.length - 1; i++) {
    for (let l = 0; l < newField[i].length - 1; l++) {
      if (newField[i][l].isFlag) {
        newField[i][l] = {
          value: newField[i][l].value,
          isOpen: false,
          isFlag: false,
        };
        props.addMineLeft();
      }
    }
  }

  return newField;
};

export const minusFlagPosition = (
  y: number,
  x: number,
  flagPosition: TFlagPosition
) => {
  let isTarget = false;
  const newPosition = flagPosition.filter((el) => {
    if (el[0] === y && el[1] === x) isTarget = true;
    return !isTarget;
  });

  return newPosition;
};
