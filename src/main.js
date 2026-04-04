import React from 'react';
import { createRoot } from 'react-dom/client';
import { mutate } from 'swr';

import { isEmpty } from 'lodash';
import App from './App';
import MessageCard from './components/blocks/Cards/MessageCard';
import FormLayout from './components/blocks/Layout/FormLayout';
import { API_OPTIONS_ENDPOINT } from './features/swr/index';
import { updateTranslationResources } from './i18n';
import reportWebVitals from './reportWebVitals';
import { Root } from './router/router';

let root;
const IG_WEBVIEW_BRIDGE_ERROR_PATTERN =
  /enableButtonsClickedMetaDataLogging.*Java object is gone/i;
const IG_WEBVIEW_BRIDGE_GUARD_FLAG = 'lwInstagramBridgeErrorGuardInstalled';

const isInstagramWebviewBridgeError = value => {
  if (!value) return false;
  if (typeof value === 'string') {
    return IG_WEBVIEW_BRIDGE_ERROR_PATTERN.test(value);
  }
  if (typeof value.message === 'string') {
    return IG_WEBVIEW_BRIDGE_ERROR_PATTERN.test(value.message);
  }
  try {
    return IG_WEBVIEW_BRIDGE_ERROR_PATTERN.test(String(value));
  } catch (_error) {
    return false;
  }
};

const suppressIfInstagramBridgeError = (event, candidate) => {
  if (!isInstagramWebviewBridgeError(candidate)) return;
  event.preventDefault?.();
  event.stopImmediatePropagation?.();
};

const installInstagramBridgeErrorGuard = () => {
  if (typeof window === 'undefined') return;
  if (window[IG_WEBVIEW_BRIDGE_GUARD_FLAG]) return;

  window[IG_WEBVIEW_BRIDGE_GUARD_FLAG] = true;
  window.addEventListener(
    'error',
    event => {
      suppressIfInstagramBridgeError(event, event.error || event.message);
    },
    true,
  );
  window.addEventListener(
    'unhandledrejection',
    event => {
      suppressIfInstagramBridgeError(event, event.reason);
    },
    true,
  );
};

installInstagramBridgeErrorGuard();

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
      user={user && !isEmpty(user) ? user : undefined}
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
      <Root restoreScroll={false}>
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

if (typeof window !== 'undefined') {
  window.renderApp = renderApp;
  window.renderMessageView = renderMessageView;
}
