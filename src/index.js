import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';

import App from './App';
import { DEVELOPMENT, IS_CAPACITOR_BUILD } from './ENVIRONMENT';
import store from './app/store';
import MessageCard from './components/blocks/Cards/MessageCard';
import FormLayout from './components/blocks/Layout/FormLayout';
import { updateTranslationResources } from './i18n';
import optionsTranslations from './options_translations.json';
import reportWebVitals from './reportWebVitals';
import { Root } from './router';

const isDevelopment = DEVELOPMENT;
const isCapacitor = IS_CAPACITOR_BUILD || false;

let root;

window.renderApp = ({ initData }, { apiTranslations }) => {
  updateTranslationResources({ apiTranslations }); // Adds all form translations from the backend!
  // If not in development just render ...
  const container = document.getElementById('root');

  if (!root) {
    root = createRoot(container);
  }
  root.render(<App data={initData} />);

  reportWebVitals();
};

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
  { apiTranslations },
) => {
  updateTranslationResources({ apiTranslations }); // Adds all form translations from the backend!

  const container = document.getElementById('root');
  if (!root) {
    root = createRoot(container);
  }
  root.render(
    <React.StrictMode>
      <Provider store={store}>
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
      </Provider>
    </React.StrictMode>,
  );
};

/**
 * 1. Frontend only development: trigger login simulator to auto login in remote server
 * 2. Frontend in Backend Development, just export `renderApp` will be called from within django view
 * 3. Capaitor build, call the `renderApp` directly as its used in full static export
 */

if (isDevelopment && !isCapacitor) {
  import('./loginSimulator.js').then(simulator => {
    simulator.simulatedAutoLogin().then(data => {
      const initData = data?.data;
      const apiTranslations = data?.api_translations;

      window.renderApp({ initData }, { apiTranslations });
    });
  });
} else if (isCapacitor) {
  const apiTranslations = JSON.parse(optionsTranslations.apiTranslations);
  const data = { apiOptions: optionsTranslations.apiOptions };

  window.renderApp({ initData: data }, { apiTranslations });
}
