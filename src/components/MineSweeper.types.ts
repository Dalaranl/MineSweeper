import { MouseEvent } from "react";

export interface IPropsMineSweeper {
  col: number;
  row: number;
  isStart: boolean;
  isClear: boolean;
  countOfMine: number;
  defaultField: TField;
  gameLevel: string;
  restart: boolean;
  setIsStart: (isStart: boolean) => void;
  setIsClear: () => void;
  addMineLeft: () => void;
  minusMineLeft: () => void;
}

export interface IPropsMineSweeperUI {
  field: TField;
  isEnd: string;
  isClear: boolean;
  gameLevel: string;
  onClickLeftBtnOnTile: (
    position: { xIndex: number; yIndex: number },
    isOpen: boolean
  ) => () => void;
  onClickRightBtnOnTile: (
    x: number,
    y: number
  ) => (e: MouseEvent<HTMLSpanElement>) => void;
}

export interface IPropsMSHeader {
  isStart: boolean;
  nowLevel: string;
  countOfMine: number;
  mineLeft: number;
  setLevel: (level: string) => void;
  restart: () => void;
}

export type TMinesweeperState = {
  isStart: boolean;
  isClear: boolean;
  restart: boolean;
  level: string;
  col: number;
  row: number;
  countOfMine: number;
  mineLeft: number;
  field: TField;
};

export interface IPropsTimer {
  isStart: boolean;
  restart: boolean;
}

export type TField = TFieldObj[][];
export type TFieldObj = { value: string; isOpen: boolean; isFlag: boolean };
export type TPosition = { xIndex: number; yIndex: number };
export type TClickHistory = { y: number; x: number }[];
export type TFlagPosition = [number, number][];
