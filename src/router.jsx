import { GlobalStyles } from '@a-little-world/little-world-design-system';
import React from 'react';
import {
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { IS_CAPACITOR_BUILD } from './ENVIRONMENT';
import ActiveCall from './call';
import RouterError from './components/blocks/ErrorView/ErrorView';
import Form from './components/blocks/Form/Form';
import AppLayout, { FullAppLayout } from './components/blocks/Layout/AppLayout';
import FormLayout from './components/blocks/Layout/FormLayout';
import Welcome from './components/blocks/Welcome/Welcome';
import ChangeEmail from './components/views/ChangeEmail';
import EditView from './components/views/Edit';
import ForgotPassword from './components/views/ForgotPassword';
import Login from './components/views/Login';
import Profile from './components/views/Profile.tsx';
import ResetPassword from './components/views/ResetPassword';
import SignUp from './components/views/SignUp';
import VerifyEmail from './components/views/VerifyEmail';
import Main from './main';
import {
  APP_ROUTE,
  BASE_ROUTE,
  CALL_ROUTE,
  CALL_SETUP_ROUTE,
  CHANGE_EMAIL_ROUTE,
  CHAT_ROUTE,
  EDIT_FORM_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  HELP_ROUTE,
  LOGIN_ROUTE,
  MESSAGES_ROUTE,
  NOTIFICATIONS_ROUTE,
  PARTNERS_ROUTE,
  RESET_PASSWORD_ROUTE,
  SETTINGS_ROUTE,
  SIGN_UP_ROUTE,
  USER_FORM_ROUTE,
  USER_PROFILE_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
} from './routes';
import theme from './theme';

const isCapacitor = IS_CAPACITOR_BUILD || false;

export const Root = ({ children, restoreScroll = true }) => (
  <ThemeProvider theme={theme}>
    {restoreScroll && <ScrollRestoration />}
    <GlobalStyles />
    {children || <Outlet />}
  </ThemeProvider>
);

const ROOT_ROUTES = [
  {
    path: LOGIN_ROUTE,
    element: (
      <FormLayout>
        <Login />
      </FormLayout>
    ),
    errorElement: <RouterError Layout={FormLayout} />,
  },
  {
    path: SIGN_UP_ROUTE,
    element: (
      <FormLayout>
        <SignUp />
      </FormLayout>
    ),
    errorElement: <RouterError Layout={FormLayout} />,
  },
  {
    path: FORGOT_PASSWORD_ROUTE,
    element: (
      <FormLayout>
        <ForgotPassword />
      </FormLayout>
    ),
    errorElement: <RouterError Layout={FormLayout} />,
  },
  {
    path: RESET_PASSWORD_ROUTE,
    element: (
      <FormLayout>
        <ResetPassword />
      </FormLayout>
    ),
    errorElement: <RouterError Layout={FormLayout} />,
  },
  {
    path: USER_FORM_ROUTE,
    element: <FormLayout />,
    errorElement: <RouterError Layout={FormLayout} />,
    children: [
      {
        path: '',
        element: <Welcome />,
      },
      {
        path: ':slug',
        element: <Form />,
      },
    ],
  },
  {
    path: getAppRoute(EDIT_FORM_ROUTE),
    element: <AppLayout />,
    errorElement: <RouterError />,
    children: [
      {
        path: ':slug',
        element: <EditView />,
      },
    ],
  },
  {
    path: APP_ROUTE,
    element: <Main />,
    errorElement: <RouterError />,
  },
  {
    path: `${APP_ROUTE}/:id`,
    element: <RouterError />,
    errorElement: <RouterError />,
  },
  {
    path: getAppRoute(VERIFY_EMAIL_ROUTE),
    element: (
      <FormLayout>
        <VerifyEmail />
      </FormLayout>
    ),
    errorElement: <RouterError Layout={FormLayout} />,
  },
  {
    path: getAppRoute(CHANGE_EMAIL_ROUTE),
    element: (
      <FormLayout>
        <ChangeEmail />
      </FormLayout>
    ),
    errorElement: <RouterError Layout={FormLayout} />,
  },
  {
    path: getAppRoute(CALL_ROUTE),
    element: <ActiveCall />,
  },
  {
    path: getAppRoute(CALL_SETUP_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(PARTNERS_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(CHAT_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(MESSAGES_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(NOTIFICATIONS_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(USER_PROFILE_ROUTE),
    element: (
      <FullAppLayout>
        <Profile />
      </FullAppLayout>
    ),
  },
  {
    path: getAppRoute(HELP_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(NOTIFICATIONS_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(SETTINGS_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(USER_FORM_ROUTE),
    element: <FormLayout />,
    errorElement: <RouterError Layout={FormLayout} />,
    children: [
      {
        path: '',
        element: <Welcome />,
      },
      {
        path: ':slug',
        element: <Form />,
      },
    ],
  },
];

if (isCapacitor) {
  ROOT_ROUTES.push({
    path: '',
    element: (
      <FormLayout>
        <Login />
      </FormLayout>
    ),
    errorElement: <RouterError />,
  });
}

const router = createBrowserRouter(
  [
    {
      path: BASE_ROUTE,
      element: <Root />,
      children: ROOT_ROUTES,
      errorElement: (
        <Root>
          <RouterError />
        </Root>
      ),
    },
  ],
  { basename: '/' },
);

export default router;
