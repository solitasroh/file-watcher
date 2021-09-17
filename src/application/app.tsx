import * as React from "react";
import GlobalStyles from "./globalStyles";
import FileWatcher from "./Views/FileWatcher";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <FileWatcher />
      <GlobalStyles></GlobalStyles>
    </React.Fragment>
  );
};

export default App;
