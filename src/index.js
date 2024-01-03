import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { IS_CAPACITOR_BUILD, DEVELOPMENT } from "./ENVIRONMENT";
import { updateTranslationResources } from "./i18n";
import reportWebVitals from "./reportWebVitals";
import optionsTranslations from "./options_translations.json";


const isDevelopment = DEVELOPMENT;
const isCapaitor = IS_CAPACITOR_BUILD || false;

window.renderApp = ({ initData }, { apiTranslations }) => {
  updateTranslationResources({ apiTranslations }); // This adds all form translations from the backend!
  // If not in development just render ...
  const container = document.getElementById("root");
  const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App data={initData} />
      </React.StrictMode>
    );

  reportWebVitals();
};


/**
 * 1. Frontend only development: trigger login simulator to auto login in remote server
 * 2. Frontend in Backend Development, just export `renderApp` will be called from within django view
 * 3. Capaitor build, call the `renderApp` directly as its used in full static export
 */

if (isDevelopment && !isCapaitor) {
  import("./loginSimulator.js").then((simulator) => {
    simulator.simulatedAutoLogin().then((data) => {
      const initData = data?.data;
      const apiTranslations = data?.api_translations;
      
      window.renderApp({ initData }, { apiTranslations });
    });
  });
}else if(isCapaitor){

  const apiTranslations = JSON.parse(optionsTranslations.apiTranslations)
  const data = { apiOptions: optionsTranslations.apiOptions }
  console.log("DATA", data, apiTranslations, isCapaitor)

  window.renderApp({ initData : data }, { apiTranslations })
}