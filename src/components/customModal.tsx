import { ChangeEvent, useState } from "react";
import { connect } from "react-redux";
import { AppDispatch, setCustomLevel } from "../app/store";
import "./MineSweeper.css";

interface IPropsCustomModal {
  setCustom: (col: number, row: number, countOfMind: number) => void;
  modalHandler: () => void;
}

const CustomModal = (props: IPropsCustomModal) => {
  const [values, setValues] = useState({
    col: 0,
    row: 0,
    countOfMind: 0,
  });

  const onChangeSetValues =
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [key]: Number(e.target.value),
      });
    };
  const onClickCustomazing = () => {
    const { col, row, countOfMind } = values;

    props.setCustom(col, row, countOfMind);

    props.modalHandler();
  };

  return (
    <div className="modal_container">
      <div className="modal title_container">
        <span className="modal title">커스터마이징</span>
      </div>
      <div className="line_container">
        <span className="line_text">가로 : </span>
        <input
          className="modal_input"
          type="text"
          onChange={onChangeSetValues("row")}
        />
      </div>
      <div className="line_container">
        <span className="line_text">세로 : </span>
        <input
          className="modal_input"
          type="text"
          onChange={onChangeSetValues("col")}
        />
      </div>
      <div className="line_container">
        <span className="line_text">지뢰 : </span>
        <input
          className="modal_input"
          type="text"
          onChange={onChangeSetValues("countOfMind")}
        />
      </div>
      <div className="button_container">
        <button className="modal_button" onClick={onClickCustomazing}>
          적용하기!
        </button>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    setCustom: (col: number, row: number, countOfMind: number) =>
      dispatch(setCustomLevel({ col, row, countOfMind })),
  };
};

export default connect(null, mapDispatchToProps)(CustomModal);
