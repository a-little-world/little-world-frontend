import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import GLOB from "./ENVIRONMENT";
import { updateTranslationResources } from "./i18n";
import reportWebVitals from "./reportWebVitals";

if (GLOB.DEVELOPMENT) {
  import("./loginSimulator.js").then((simulator) => {
    simulator
      .simulatedAutoLogin(GLOB.DEFAULT_LOGIN_USERNAME, GLOB.DEFAULT_LOGIN_PASSWORD)
      .then((data) => {
        console.log(data);
        console.log("start rendering now...");

        const initData = data.initial_profile_data;
        ReactDOM.render(
          <React.StrictMode>
            <App initData={initData} />
          </React.StrictMode>,
          document.getElementById("root")
        );

        reportWebVitals();
      });
  });
} else {
  window.renderApp = ({ initData }, { apiTranslations }) => {
    updateTranslationResources({ apiTranslations }); // This adds all form translations from the backend!
    // If not in development just render ...
    console.log("initialData", initData, apiTranslations);
    ReactDOM.render(
      <React.StrictMode>
        <App initData={initData} />
      </React.StrictMode>,
      document.getElementById("root")
    );

    reportWebVitals();
  };
}
