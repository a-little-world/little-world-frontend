import React from 'react';
import { createRoot } from 'react-dom/client';

import App, { InitializeDux } from './App';
import { DEVELOPMENT } from './ENVIRONMENT';
import MessageCard from './components/blocks/Cards/MessageCard';
import FormLayout from './components/blocks/Layout/FormLayout';
import { updateTranslationResources } from './i18n';
import reportWebVitals from './reportWebVitals';
import { Root } from './router/router';

const isDevelopment = DEVELOPMENT;

let root;

window.renderApp = ({ user, apiTranslations, apiOptions }) => {
  updateTranslationResources({ apiTranslations }); // Adds all form translations from the backend!
  // If not in development just render ...
  const container = document.getElementById('root');

  if (!root) {
    root = createRoot(container);
  }
  console.log("RENDERING APP V2", { user, apiTranslations, apiOptions })
  root.render(<App user={user} apiTranslations={apiTranslations} apiOptions={apiOptions} />);

  reportWebVitals();
}

window.renderMessageView = (
  {
    title,
    content,
    confirmText,
    rejectText,
    onConfirm,
    onReject,
    linkText,
    linkTo,
  },
  { apiOptions, apiTranslations },
) => {
  updateTranslationResources({ apiTranslations }); // Adds all form translations from the backend!

  const container = document.getElementById('root');
  if (!root) {
    root = createRoot(container);
  }
  root.render(
    <React.StrictMode>
      <Root restoreScroll={false} includeModeSwitch={false}>
        <FormLayout>
          <MessageCard
            title={title}
            content={content}
            confirmText={confirmText}
            rejectText={rejectText}
            onConfirm={onConfirm}
            onReject={onReject}
            linkText={linkText}
            linkTo={linkTo}
          />
        </FormLayout>
      </Root>
      <InitializeDux
        data={{
          apiOptions,
        }}
      />
    </React.StrictMode>,
  );
};

/**
 * 1. Frontend only development: trigger login simulator to auto login in remote server
 * 2. Frontend in Backend Development, just export `renderApp` will be called from within django view
 * 3. Capaitor build, call the `renderApp` directly as its used in full static export
 */

if (isDevelopment) {
  import('./loginSimulator.js').then(simulator => {
    simulator.simulatedAutoLogin().then(data => {
      const initData = data?.data;
      const apiTranslations = data?.api_translations;

      window.renderApp({ initData, apiTranslations });
    });
  });
}
