import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";

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
    
    Sentry.init({
      dsn: "https://9726397c1f42ffb5d79cbcc31dfe3c8e@s.t1m.me/3",
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ["localhost", /^https:\/\/little-world\.com\/api/],
        }),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    updateTranslationResources({ apiTranslations }); // This adds all form translations from the backend!
    // If not in development just render ...
    ReactDOM.render(
      <React.StrictMode>
        <App initData={initData} />
      </React.StrictMode>,
      document.getElementById("root")
    );

    reportWebVitals();
  };
}
