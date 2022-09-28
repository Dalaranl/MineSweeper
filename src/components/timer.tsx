import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { IPropsTimer, TMinesweeperState } from "./MineSweeper.types";

const Timer = (props: IPropsTimer) => {
  const time = useRef(0);
  const [sec, setSec] = useState("000");

  useEffect(() => {
    let timer: any;
    if (props.isStart) {
      timer = setInterval(() => {
        setSec(String(time.current % 60).padStart(3, "0"));
      }, 1000);

      time.current += 1;

      if (time.current === 999) return;
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [sec, props.isStart]);

  useEffect(() => {
    time.current = 0;
    setSec("000");
  }, [props.restart]);

  return <span>{`${sec}`}</span>;
};

const mapStateToPrps = (state: TMinesweeperState) => {
  return {
    isStart: state.isStart,
    restart: state.restart,
  };
};

export default connect(mapStateToPrps)(Timer);
