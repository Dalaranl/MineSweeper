import { MouseEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addMineLeft,
  AppDispatch,
  minusMineLeft,
  setIsClear,
  setIsStart,
} from "../app/store";
import { MINE } from "../data/level";
import { createField } from "../functions/createField";
import { flagCheck, isClearCheck } from "../functions/endClearFuc";
import {
  searchCurrentTile,
  setFieldValue,
  setMines,
} from "../functions/fieldSetting";
import { minusFlagPosition, resetFlag } from "../functions/flagFunc";
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

  // reset_button click event
  useEffect(() => {
    const newField = createField(props.col, props.row);
    setField([...newField]);
    setIsEnd("");
    setIsClear(false);
    setFlagPosition([]);
  }, [props.restart, props.col, props.row]);

  // game clear & end event
  const clearGame = () => {
    props.setIsStart(false);
    props.setIsClear();
    setIsClear(true);
  };

  const endGame = (field: TField) => {
    const nowField = field;
    for (let y = 0; y < props.col; y++) {
      for (let x = 0; x < props.row; x++) {
        nowField[y][x] = {
          ...nowField[y][x],
          isOpen: true,
        };
      }
    }
    setIsEnd("isEnd");
    props.setIsStart(false);

    return nowField;
  };

  // 좌클릭 이벤트
  const onClickLeftBtnOnTile = (position: TPosition, isOpen: boolean) => () => {
    const { yIndex, xIndex } = position;
    let nowField = field;
    let newFlagPosition = flagPosition;
    if (isOpen) return;
    if (field[yIndex][xIndex].isFlag) return;
    nowField[yIndex][xIndex] = {
      ...nowField[yIndex][xIndex],
      isOpen: true,
    };
    if (!props.isStart) {
      props.setIsStart(true);
      nowField = resetFlag(nowField, props);
      nowField = setMines(yIndex, xIndex, nowField, props);
      nowField = setFieldValue(nowField, props.col, props.row);
      const resultField = searchCurrentTile(
        yIndex,
        xIndex,
        nowField,
        props,
        flagPosition
      );
      nowField = resultField.nowField;
      setFlagPosition((prev) => []);
    } else {
      if (field[yIndex][xIndex].value === MINE) endGame(nowField);
      if (field[yIndex][xIndex].value === "0") {
        const resultField = searchCurrentTile(
          yIndex,
          xIndex,
          nowField,
          props,
          flagPosition
        );
        nowField = resultField.nowField;
        newFlagPosition = resultField.newFlagPosition;
      }
    }

    const check_result = isClearCheck(
      field,
      props.col,
      props.row,
      props.countOfMine
    );
    if (check_result) clearGame();
    else {
      setFlagPosition(newFlagPosition);
      setField((prev) => [...nowField]);
    }
  };

  // 우클릭 이벤트
  const onClickRightBtnOnTile =
    (x: number, y: number) => (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      if (field[y][x].isOpen) return;

      const newField = field;
      if (flagPosition.length === props.countOfMine && !newField[y][x].isFlag)
        return;

      let newFlagPosition = flagPosition;
      if (!newField[y][x].isFlag) {
        newField[y][x] = {
          ...newField[y][x],
          isFlag: true,
        };
        newFlagPosition = [...flagPosition, [y, x]];
        props.minusMineLeft();
      } else {
        newField[y][x] = {
          ...newField[y][x],
          isFlag: false,
        };
        newFlagPosition = minusFlagPosition(y, x, flagPosition);
        props.addMineLeft();
      }

      if (newFlagPosition.length === props.countOfMine) {
        const isFlag = flagCheck(newFlagPosition, field, props.countOfMine);
        if (isFlag) clearGame();
      }

      setFlagPosition((prev) => [...newFlagPosition]);
      setField([...newField]);
    };

  return (
    <MineSweeperUI
      field={field}
      isEnd={isEnd}
      isClear={isClear}
      gameLevel={props.gameLevel}
      onClickLeftBtnOnTile={onClickLeftBtnOnTile}
      onClickRightBtnOnTile={onClickRightBtnOnTile}
    />
  );
};

// redux
const mapStateToProps = (state: TMinesweeperState) => {
  return {
    col: state.col,
    row: state.row,
    restart: state.restart,
    gameLevel: state.level,
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
