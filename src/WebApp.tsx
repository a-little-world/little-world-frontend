import React from 'react';
// @ts-ignore - react-dom/client types may not be available
import { createRoot } from 'react-dom/client';

import App from './App';
import { updateTranslationResources } from './i18n';
import reportWebVitals from './reportWebVitals';

let root: any;

export default function WebApp() {
  // If not in development just render ...
  const container = document.getElementById('root');

  if (!root) {
    root = createRoot(container);
  }
  root.render(
    <App
      user={undefined}
      apiTranslations={undefined}
      apiOptions={undefined}
    />,
  );

  reportWebVitals();
}
