import React, { FC } from "react";
import GlobalStyles from "./globalStyles";
import FileWatcher from "./Views/FileWatcher";

const App: FC = () => (
    <>
      <FileWatcher />
      <GlobalStyles />
    </>
  );

export default App;
