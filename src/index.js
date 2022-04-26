import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import GLOB from "./ENVIRONMENT";

if (GLOB.DEVELOPMENT) {
  // Only way I found to do a conditional import
  import("./login-simulator.js").then((simulator) => {
    /*
     * These can be changed before window.reload()
     */
    const login_user =
      window.localStorage.getItem("current_login_user") || GLOB.DEFAULT_LOGIN_USERNAME;
    const login_pass =
      window.localStorage.getItem("current_login_pass") || GLOB.DEFAULT_LOGIN_PASSWORD;

    /*
  Rendering the DOM only after the login call is done
  This is prob agains all sorts of js/react principles,
  but it can safely be removed in production
  */
    simulator.awaitSimulatedLogin(login_user, login_pass, true).then((data) => {
      console.log(data);
      console.log("start rendering now...");

      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById("root")
      );

      // If you want to start measuring performance in your app, pass a function
      // to log results (for example: reportWebVitals(console.log))
      // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
      reportWebVitals();
    });
  });
} else {
  // If not in development just render ...
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
