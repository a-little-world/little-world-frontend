import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import GLOB from "./ENVIRONMENT";

if (GLOB.DEVELOPMENT) {
  import("./login-simulator.js").then((simulator) => {
    /*
     * These can be changed before window.reload()
     */
    const login_user =
      window.localStorage.getItem("current_login_user") || GLOB.DEFAULT_LOGIN_USERNAME;
    const login_pass =
      window.localStorage.getItem("current_login_pass") || GLOB.DEFAULT_LOGIN_PASSWORD;

    simulator.awaitSimulatedLogin(login_user, login_pass, true).then((data) => {
      console.log(data);
      console.log("start rendering now...");

      const initData = data.initial_profile_data;
      ReactDOM.render(
        <React.StrictMode>
          <App initData={initData}/>
        </React.StrictMode>,
        document.getElementById("root")
      );

      reportWebVitals();
    });
  });
} else {
  window.renderApp = ({initData}) => {
  // If not in development just render ...
  console.log("initialData", initData);
    ReactDOM.render(
      <React.StrictMode>
        <App initData={initData} />
      </React.StrictMode>,
      document.getElementById("root")
    );

    reportWebVitals();
  }
}
