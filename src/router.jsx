import { GlobalStyles } from '@a-little-world/little-world-design-system';
import React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { IS_CAPACITOR_BUILD } from './ENVIRONMENT';
import ActiveCall from './call';
import RouterError from './components/blocks/ErrorView/ErrorView';
import Form from './components/blocks/Form/Form';
import FormLayout from './components/blocks/Layout/FormLayout';
import Welcome from './components/blocks/Welcome/Welcome';
import ChangeEmail from './components/views/ChangeEmail';
import ForgotPassword from './components/views/ForgotPassword';
import Login from './components/views/Login';
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
  FORGOT_PASSWORD_ROUTE,
  HELP_ROUTE,
  LOGIN_ROUTE,
  NOTIFICATIONS_ROUTE,
  PARTNERS_ROUTE,
  PROFILE_ROUTE,
  RESET_PASSWORD_ROUTE,
  SETTINGS_ROUTE,
  SIGN_UP_ROUTE,
  USER_FORM_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
} from './routes';
import theme from './theme';

const isCapacitor = IS_CAPACITOR_BUILD || false;

export const Root = ({ children }) => (
  <ThemeProvider theme={theme}>
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
    errorElement: <RouterError />,
  },
  {
    path: SIGN_UP_ROUTE,
    element: (
      <FormLayout>
        <SignUp />
      </FormLayout>
    ),
    errorElement: <RouterError />,
  },
  {
    path: FORGOT_PASSWORD_ROUTE,
    element: (
      <FormLayout>
        <ForgotPassword />
      </FormLayout>
    ),
    errorElement: <RouterError />,
  },
  {
    path: RESET_PASSWORD_ROUTE,
    element: (
      <FormLayout>
        <ResetPassword />
      </FormLayout>
    ),
    errorElement: <RouterError />,
  },
  {
    path: USER_FORM_ROUTE,
    element: <FormLayout />,
    errorElement: <RouterError />,
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
    errorElement: <RouterError />,
  },
  {
    path: getAppRoute(CHANGE_EMAIL_ROUTE),
    element: (
      <FormLayout>
        <ChangeEmail />
      </FormLayout>
    ),
    errorElement: <RouterError />,
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
    path: getAppRoute(NOTIFICATIONS_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(PROFILE_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(HELP_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(SETTINGS_ROUTE),
    element: <Main />,
  },
  {
    path: getAppRoute(USER_FORM_ROUTE),
    element: <FormLayout />,
    errorElement: <RouterError />,
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
    },
  ],
  { basename: '/' },
);

export default router;
