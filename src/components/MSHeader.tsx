import { connect } from "react-redux";
import { AppDispatch, reStart, setCustomLevel, setLevel } from "../app/store";
import { level } from "../data/level";
import { IPropsMSHeader, TMinesweeperState } from "./MineSweeper.types";
import "./MineSweeper.css";

const MSHeader = (props: IPropsMSHeader) => {
  const onClickSetLevel = (level: string) => () => {
    props.setLevel(level);
  };

  return (
    <div className="msheader">
      <div className="level_container">
        <span className="level" onClick={onClickSetLevel(level.beginner.name)}>
          {level.beginner.name}
        </span>
        <span
          className="level"
          onClick={onClickSetLevel(level.intermediate.name)}
        >
          {level.intermediate.name}
        </span>
        <span className="level" onClick={onClickSetLevel(level.expert.name)}>
          {level.expert.name}
        </span>
        <span className="level">{level.custom.name}</span>
      </div>
      <div className="info_container">
        <div className="info">
          <span>Left: {props.mineLeft}</span>
        </div>
        <div className="info">
          <span>level: {props.nowLevel}</span>
        </div>
        <div
          className="info"
          onClick={() => {
            props.restart();
          }}
        >
          <span>reset</span>
        </div>
      </div>
      <div className="timer">
        <span></span>
      </div>
    </div>
  );
};

const mapStateToProps = (state: TMinesweeperState) => {
  return {
    isStart: state.isStart,
    nowLevel: state.level,
    countOfMine: state.countOfMine,
    mineLeft: state.mineLeft,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    setLevel: (level: string) => dispatch(setLevel(level)),
    setCustomLevel: (col: number, row: number, countOfMine: number) =>
      dispatch(setCustomLevel({ col, row, countOfMine })),
    restart: () => dispatch(reStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MSHeader);
