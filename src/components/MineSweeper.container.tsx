import { MouseEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addMineLeft,
  AppDispatch,
  minusMineLeft,
  setIsStart,
} from "../app/store";
import { MINE } from "../data/level";
import { createField } from "../functions/createField";
import MineSweeperUI from "./MineSweeper.presenter";
import {
  IPropsMineSweeper,
  TClickHistory,
  TField,
  TMinesweeperState,
  TPosition,
} from "./MineSweeper.types";

const SEARCH_POSITION = [
  { y: -1, x: -1 },
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: 1 },
  { y: 0, x: -1 },
  { y: 1, x: 1 },
  { y: 1, x: 0 },
  { y: 1, x: -1 },
];

const MineSweeper = (props: IPropsMineSweeper) => {
  const [field, setField] = useState<TField>([
    [{ value: "0", isOpen: false, isFlag: false }],
  ]);
  const [clickHistory, setClickHistory] = useState<TClickHistory>();
  const [isEnd, setIsEnd] = useState<string>("");

  useEffect(() => {
    const newField = createField(props.col, props.row);
    setField([...newField]);
    setIsEnd("");
  }, [props.restart]);

  const getRandomNumber = (max: number) => {
    const number = Math.random() * max;
    return Math.floor(number);
  };

  const getCoordinate = () => {
    const x = getRandomNumber(props.row);
    const y = getRandomNumber(props.col);

    return { x, y };
  };

  const setMines = (y: number, x: number, newField: TField) => {
    if (!field) return;
    let count = 0;
    const currentArr = [];

    for (let i = 0; i < SEARCH_POSITION.length; i++) {
      const result = setPosition(y, x, i);

      if (result) {
        currentArr.push({ currentY: result.nowY, currentX: result.nowX });
      }
    }

    while (count < props.countOfMine) {
      let isCurrent = false;
      const { x, y } = getCoordinate();

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
    setField([...newField]);
  };

  const setPosition = (y: number, x: number, index: number) => {
    const nowY = y + SEARCH_POSITION[index].y;
    const nowX = x + SEARCH_POSITION[index].x;

    if (nowY === -1 || nowY === props.col) return false;
    if (nowX === -1 || nowX === props.row) return false;

    return { nowY, nowX };
  };

  const countMine = (y: number, x: number, field: TField): TField => {
    const newField = field;

    if (newField[y][x].value === MINE) return newField;

    let count = 0;

    for (let i = 0; i < SEARCH_POSITION.length; i++) {
      const result = setPosition(y, x, i);

      if (result && newField[result.nowY][result.nowX].value === MINE) count++;
    }

    newField[y][x] = {
      value: String(count),
      isOpen: newField[y][x].isOpen,
      isFlag: false,
    };

    return newField;
  };

  const setFieldValue = () => {
    let newField = field;
    for (let y = 0; y < props.col; y++) {
      for (let x = 0; x < props.row; x++) {
        newField = countMine(y, x, newField);
      }
    }
    setField([...newField]);
  };

  const endGame = (field: TField) => {
    const nowField = field;
    for (let y = 0; y < props.col; y++) {
      for (let x = 0; x < props.row; x++) {
        nowField[y][x] = {
          value: nowField[y][x].value,
          isOpen: true,
          isFlag: false,
        };
      }
    }
    setIsEnd("isEnd");
    props.setIsStart(false);

    return nowField;
  };

  const searchCurrentTile = (y: number, x: number, newField: TField) => {
    const nowField = newField;

    if (parseInt(nowField[y][x].value) > 0) {
      nowField[y][x] = {
        value: nowField[y][x].value,
        isOpen: true,
        isFlag: false,
      };

      return nowField;
    }

    if (nowField[y][x].value === MINE) {
      const endField = endGame(nowField);
      return endField;
    }

    for (let i = 0; i < SEARCH_POSITION.length; i++) {
      const result = setPosition(y, x, i);

      if (result && parseInt(nowField[result.nowY][result.nowX].value) > 0) {
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
        nowField[result.nowY][result.nowX] = {
          value: nowField[result.nowY][result.nowX].value,
          isOpen: true,
          isFlag: false,
        };

        searchCurrentTile(result.nowY, result.nowX, nowField);
      }
    }

    return nowField;
  };

  const checkTile = (nowField: TField) => {
    let isValid = false;
    let count = 0;

    for (let i = 0; i < nowField.length - 1; i++) {
      for (let j = 0; j < nowField[i].length - 1; j++) {
        if (!nowField[i][j].isOpen) count++;
      }
    }

    if (count === props.countOfMine) isValid = true;

    return isValid;
  };

  const onClickTile = (position: TPosition, isOpen: boolean) => () => {
    const { yIndex, xIndex } = position;
    const nowField = field;

    nowField[yIndex][xIndex] = {
      value: nowField[yIndex][xIndex].value,
      isOpen: true,
      isFlag: false,
    };

    if (!props.isStart) {
      props.setIsStart(true);
      setMines(yIndex, xIndex, nowField);
      setFieldValue();
    }

    if (isOpen) return;

    const newField = searchCurrentTile(yIndex, xIndex, nowField);
    const checkResult = checkTile(nowField);

    if (checkResult) endGame(nowField);
    else setField([...newField]);
  };

  const onContextMenuTile =
    (x: number, y: number) => (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      const newField = field;
      if (!e.currentTarget.innerHTML) {
        newField[y][x] = {
          value: newField[y][x].value,
          isOpen: false,
          isFlag: true,
        };

        props.minusMineLeft();
      } else {
        newField[y][x] = {
          value: newField[y][x].value,
          isOpen: false,
          isFlag: false,
        };

        props.addMineLeft();
      }

      setField([...newField]);
    };

  return (
    <MineSweeperUI
      field={field}
      isEnd={isEnd}
      onClickTile={onClickTile}
      onContextMenuTile={onContextMenuTile}
    />
  );
};

const mapStateToProps = (state: TMinesweeperState) => {
  return {
    col: state.col,
    row: state.row,
    restart: state.restart,
    nowLevel: state.level,
    isStart: state.isStart,
    countOfMine: state.countOfMine,
    defaultField: state.field,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    setIsStart: (isStart: boolean) => dispatch(setIsStart({ isStart })),
    addMineLeft: () => dispatch(addMineLeft()),
    minusMineLeft: () => dispatch(minusMineLeft()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MineSweeper);
