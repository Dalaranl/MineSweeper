import React from "react";
import { Provider } from "react-redux";
import minsweeperStore from "./app/store";
import MineSweeperPage from "./pages/MineSweeper";

function App() {
  return (
    <Provider store={minsweeperStore}>
      <MineSweeperPage />
    </Provider>
  );
}

export default App;
