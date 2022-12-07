import React from "react";
import ReactDOM from "react-dom";

import "index.scss";

import Application from "components/Application";

// ReactDOM.render(<Application />, document.getElementById("root"));

ReactDOM.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
  document.getElementById('root') || document.createElement('div')
);
