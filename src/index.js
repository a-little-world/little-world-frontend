import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import GLOB from "./ENVIRONMENT";
import { updateTranslationResources } from "./i18n";
import reportWebVitals from "./reportWebVitals";

if (GLOB.DEVELOPMENT) {
  import("./loginSimulator.js").then((simulator) => {
    simulator.simulatedAutoLogin().then((data) => {
      const initData = data?.data;
      const apiTranslations = data?.api_translations;
      if (apiTranslations) updateTranslationResources({ apiTranslations }); // This adds all form translations from the backend!

      const container = document.getElementById("root");
      const root = createRoot(container);

      root.render(
        <React.StrictMode>
          <App data={initData} />
        </React.StrictMode>
      );

      reportWebVitals();
    });
  });
} else {
  window.renderApp = ({ initData }, { apiTranslations }, publicRoutes = false) => {
    updateTranslationResources({ apiTranslations }); // This adds all form translations from the backend!
    // If not in development just render ...
    const container = document.getElementById("root");
    const root = createRoot(container);
    if (!publicRoutes) {
      root.render(
        <React.StrictMode>
          <App data={initData} />
        </React.StrictMode>
      );
    } else {
      root.render(
        <React.StrictMode>
          <App data={initData} />
        </React.StrictMode>
      );
    }

    reportWebVitals();
  };
}
