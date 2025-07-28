import React from 'react';
import { createRoot } from 'react-dom/client';
import { mutate } from 'swr';

import App from './App';
import MessageCard from './components/blocks/Cards/MessageCard';
import FormLayout from './components/blocks/Layout/FormLayout';
import { environment } from './environment';
import { API_OPTIONS_ENDPOINT } from './features/swr/index';
import { updateTranslationResources } from './i18n';
import reportWebVitals from './reportWebVitals';
import { Root } from './router/router';

let root;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function renderApp({ user, apiTranslations, apiOptions }) {
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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function renderMessageView(
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
) {
  updateTranslationResources({ apiTranslations }); // Adds all form translations from the backend!
  mutate(API_OPTIONS_ENDPOINT, apiOptions, false);

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
      {/* InitializeDux removed */}
    </React.StrictMode>,
  );
}