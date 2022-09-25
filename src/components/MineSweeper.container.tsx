import { MouseEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addMineLeft,
  AppDispatch,
  minusMineLeft,
  setIsClear,
  setIsStart,
} from "../app/store";
import { MINE, SEARCH_POSITION } from "../data/level";
import { createField } from "../functions/createField";
import MineSweeperUI from "./MineSweeper.presenter";
import {
  IPropsMineSweeper,
  TField,
  TFlagPosition,
  TMinesweeperState,
  TPosition,
} from "./MineSweeper.types";

const MineSweeper = (props: IPropsMineSweeper) => {
  const [field, setField] = useState<TField>([
    [{ value: "0", isOpen: false, isFlag: false }],
  ]);
  const [isEnd, setIsEnd] = useState<string>("");
  const [isClear, setIsClear] = useState(false);
  const [flagPosition, setFlagPosition] = useState<TFlagPosition>([]);

  useEffect(() => {
    const newField = createField(props.col, props.row);
    setField([...newField]);
    setIsEnd("");
  }, [props.restart]);

  useEffect(() => {
    if (flagPosition.length === props.countOfMine) {
      isClearGame();
    }
    console.log(field, "field");
    console.log(
      "flagPosition.length, props.countOfMine",
      flagPosition,
      props.countOfMine
    );
  }, [flagPosition]);

  useEffect(() => {
    setIsClear((prev) => props.isClear);
  }, [props.isClear]);

  const isClearGame = () => {
    let count = 0;
    console.log("now isClearGameFunc");
    flagPosition.map((el) => {
      if (field[el[0]][el[1]].value === MINE) count++;
    });
    if (count === props.countOfMine) {
      clearGame();
    }
  };

  const clearGame = () => {
    props.setIsStart(false);
    props.setIsClear();
  };

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

    for (let i = 0; i < SEARCH_POSITION.length; i++) {
      const result = setPosition(y, x, i);

      if (result && nowField[result.nowY][result.nowX].value !== "0") {
        if (nowField[result.nowY][result.nowX].isFlag) {
          setFlagPosition(minusFlagPosition(result.nowY, result.nowX));
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
          setFlagPosition(minusFlagPosition(result.nowY, result.nowX));
          props.addMineLeft();
        }
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

  const resetFlag = (nowField: TField) => {
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
    setFlagPosition((prev) => []);
    return newField;
  };

  const isClearCheck = (nowField: TField) => {
    let isValue = false;
    let count = 0;
    console.log("check", nowField);
    for (let y = 0; y < nowField.length; y++) {
      for (let x = 0; x < nowField[y].length; x++) {
        if (nowField[y][x].isOpen) count++;
      }
    }
    console.log(count, "count");
    if (props.col * props.row - count === props.countOfMine) isValue = true;

    return isValue;
  };

  const onClickLeftBtnOnTile = (position: TPosition, isOpen: boolean) => () => {
    const { yIndex, xIndex } = position;
    let nowField = field;
    if (isOpen) return;
    if (field[yIndex][xIndex].isFlag) return;
    if (!props.isStart) {
      props.setIsStart(true);
      nowField = resetFlag(nowField);
      setMines(yIndex, xIndex, nowField);
      setFieldValue();
      nowField = searchCurrentTile(yIndex, xIndex, nowField);
    } else {
      if (field[yIndex][xIndex].value === MINE) endGame(nowField);
      if (field[yIndex][xIndex].value === "0") {
        nowField = searchCurrentTile(yIndex, xIndex, nowField);
      } else {
        nowField[yIndex][xIndex] = {
          value: nowField[yIndex][xIndex].value,
          isOpen: true,
          isFlag: false,
        };
      }
    }
    const check_result = isClearCheck(field);
    if (check_result) clearGame();
    else setField((prev) => [...nowField]);
  };

  const minusFlagPosition = (y: number, x: number) => {
    const newPosition = flagPosition.filter((el) => el[0] + el[1] !== y + x);
    return newPosition;
  };

  const onClickRightBtnOnTile =
    (x: number, y: number) => (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      if (field[y][x].isOpen) return;

      const newField = field;
      if (!e.currentTarget.innerHTML) {
        newField[y][x] = {
          value: newField[y][x].value,
          isOpen: false,
          isFlag: true,
        };
        setFlagPosition((prev) => [...prev, [y, x]]);
        props.minusMineLeft();
      } else {
        newField[y][x] = {
          value: newField[y][x].value,
          isOpen: false,
          isFlag: false,
        };
        const newFlagPosition = minusFlagPosition(y, x);
        setFlagPosition([...newFlagPosition]);
        props.addMineLeft();
      }

      setField([...newField]);
    };

  return (
    <MineSweeperUI
      field={field}
      isEnd={isEnd}
      isClear={isClear}
      onClickLeftBtnOnTile={onClickLeftBtnOnTile}
      onClickRightBtnOnTile={onClickRightBtnOnTile}
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
    isClear: state.isClear,
    countOfMine: state.countOfMine,
    defaultField: state.field,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    setIsStart: (isStart: boolean) => dispatch(setIsStart({ isStart })),
    setIsClear: () => dispatch(setIsClear()),
    addMineLeft: () => dispatch(addMineLeft()),
    minusMineLeft: () => dispatch(minusMineLeft()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MineSweeper);
