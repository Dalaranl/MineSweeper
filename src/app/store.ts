import {
  configureStore,
  createSlice,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { TMinesweeperState } from "../components/MineSweeper.types";
import { level } from "../data/level";
import { setCustomObject, setLevelObject } from "../functions/setLevelObject";

const minesweeper = createSlice({
  name: "minesweeper",
  initialState: setLevelObject(level.beginner.name, false),
  reducers: {
    setIsStart: (state, actions) => {
      const nextState = {
        ...state,
        ...actions.payload,
      };

      return nextState;
    },
    setLevel: (state, actions) => {
      const nextState: TMinesweeperState = setLevelObject(
        actions.payload,
        state.restart
      );

      return nextState;
    },
    setCustomLevel: (_, actions) => {
      const { col, row, countOfMine } = actions.payload;
      const nextState = setCustomObject(col, row, countOfMine);

      return nextState;
    },
    reStart: (state) => {
      const nextState = {
        ...state,
        restart: !state.restart,
        isStart: false,
        mineLeft: state.countOfMine,
      };
      return nextState;
    },
    addMineLeft: (state) => {
      const nextState = {
        ...state,
        mineLeft: state.mineLeft + 1,
      };

      return nextState;
    },
    minusMineLeft: (state) => {
      const nextState = {
        ...state,
        mineLeft: state.mineLeft - 1,
      };

      return nextState;
    },
  },
});

const minsweeperStore = configureStore({ reducer: minesweeper.reducer });

export const {
  setCustomLevel,
  setIsStart,
  setLevel,
  reStart,
  addMineLeft,
  minusMineLeft,
} = minesweeper.actions;

export default minsweeperStore;

export type AppDispatch = typeof minsweeperStore.dispatch;
export type RootState = ReturnType<typeof minsweeperStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
