import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { updateTranslationResources } from './i18n';
import reportWebVitals from './reportWebVitals';

let root: any;

export default function WebApp() {
  const apiTranslations = undefined;
  const user = undefined;
  const apiOptions = undefined;
  updateTranslationResources({ apiTranslations }); // Adds all form translations from the backend!
  // If not in development just render ...
  const container = document.getElementById('root');

  if (!root) {
    root = createRoot(container);
  }
  root.render(
    <App
      user={user}
      apiTranslations={apiTranslations}
      apiOptions={apiOptions}
    />,
  );

  reportWebVitals();
  return null;
}
