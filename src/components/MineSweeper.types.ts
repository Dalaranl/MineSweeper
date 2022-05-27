import { MouseEvent } from "react";

export interface IPropsMineSweeper {
  col: number;
  row: number;
  isStart: boolean;
  countOfMine: number;
  defaultField: TField;
  nowLevel: string;
  restart: boolean;
  setIsStart: (isStart: boolean) => void;
  addMineLeft: () => void;
  minusMineLeft: () => void;
}

export interface IPropsMineSweeperUI {
  field: TField;
  isEnd: string;
  onClickTile: (
    position: { xIndex: number; yIndex: number },
    isOpen: boolean
  ) => () => void;
  onContextMenuTile: (
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
  restart: boolean;
  level: string;
  col: number;
  row: number;
  countOfMine: number;
  mineLeft: number;
  field: TField;
};

export type TField = TFieldObj[][];
export type TFieldObj = { value: string; isOpen: boolean; isFlag: boolean };
export type TPosition = { xIndex: number; yIndex: number };
export type TClickHistory = { y: number; x: number }[];
