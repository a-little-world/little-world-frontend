import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';


import App from "./App";
import GLOB from "./ENVIRONMENT";
import { updateTranslationResources } from "./i18n";
import reportWebVitals from "./reportWebVitals";

if (GLOB.DEVELOPMENT) {
  import("./loginSimulator.js").then((simulator) => {
    simulator.simulatedAutoLogin().then((data) => {
      const initData = JSON.parse(data.profile_data);
      const apiTranslations = JSON.parse(data.api_translations);
      updateTranslationResources({ apiTranslations }); // This adds all form translations from the backend!
      
      const container = document.getElementById("root");
      const root = createRoot(container);

      root.render(
        <React.StrictMode>
          <App data={initData} />
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
      const container = document.getElementById("root");
      const root = createRoot(container);
      root.render(
      <React.StrictMode>
        <App initData={initData} />
      </React.StrictMode>)

    reportWebVitals();
  };
}
