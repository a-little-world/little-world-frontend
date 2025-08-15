import {
  CustomThemeProvider,
  GlobalStyles,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom';

import FireBase from '../Firebase';
import WebsocketBridge from '../WebsocketBridge';
import { ModeSwitch } from '../components/atoms/ModeSwitch';
import RouterError from '../components/blocks/ErrorView/ErrorView';
import Form from '../components/blocks/Form/Form';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout';
import FormLayout from '../components/blocks/Layout/FormLayout';
import { ToastProvider } from '../components/blocks/Toast';
import Welcome from '../components/blocks/Welcome/Welcome';
import AboutUs from '../components/views/AboutUs/AboutUs';
import ChangeEmail from '../components/views/ChangeEmail';
import EditView from '../components/views/Edit';
import EmailPreferences from '../components/views/EmailPreferences';
import ForgotPassword from '../components/views/ForgotPassword';
import Help from '../components/views/Help';
import Main from '../components/views/Home';
import Login from '../components/views/Login';
import Messages from '../components/views/Messages';
import Notifications from '../components/views/Notifications';
import Profile from '../components/views/Profile';
import ResetPassword from '../components/views/ResetPassword';
import Resources from '../components/views/Resources/Resources';
import Settings from '../components/views/Settings';
import SignUp from '../components/views/SignUp';
import VerifyEmail from '../components/views/VerifyEmail';
import VideoCall from '../components/views/VideoCall';
import { environment } from '../environment';
import AuthGuard from '../guards/AuthGuard';
import {
  APP_ROUTE,
  BASE_ROUTE,
  BEGINNERS_ROUTE,
  CALL_ROUTE,
  CALL_SETUP_ROUTE,
  CHANGE_EMAIL_ROUTE,
  CHAT_ROUTE,
  COMMUNITY_EVENTS_ROUTE,
  DONATE_ROUTE,
  EDIT_FORM_ROUTE,
  EMAIL_PREFERENCES_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  HELP_ROUTE,
  LANGUAGE_RESOURCES_ROUTE,
  LOGIN_ROUTE,
  MESSAGES_ROUTE,
  MY_STORY_ROUTE,
  NOTIFICATIONS_ROUTE,
  OUR_WORLD_ROUTE,
  PARTNERS_ROUTE,
  PARTNER_ROUTE,
  RESET_PASSWORD_ROUTE,
  RESOURCES_ROUTE,
  SETTINGS_ROUTE,
  SIGN_UP_ROUTE,
  SUPPORT_US_ROUTE,
  TRAININGS_ROUTE,
  TRAINING_ROUTE,
  USER_FORM_ROUTE,
  USER_PROFILE_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
} from './routes';
import { Button } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

export const Root = ({
  children,
  restoreScroll = true,
  includeModeSwitch = false,
}) => (
  <CustomThemeProvider>
    <ToastProvider>
      <AuthGuard>
        <WebsocketBridge />
        {!environment.isNative && <FireBase />}
      </AuthGuard>
      {restoreScroll && <ScrollRestoration />}
      <GlobalStyles />
      <Button>HI</Button>
      {children || <Outlet />}
      {includeModeSwitch && <ModeSwitch />}
    </ToastProvider>
  </CustomThemeProvider>
);

export function getWebRouter() {
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
      path: EMAIL_PREFERENCES_ROUTE,
      element: (
        <FormLayout>
          <EmailPreferences />
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
      element: <FullAppLayout />,
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
      element: (
        <FullAppLayout>
          <Main />
        </FullAppLayout>
      ),
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
      element: <VideoCall />,
    },
    {
      path: getAppRoute(CALL_SETUP_ROUTE),
      element: (
        <FullAppLayout>
          <Main />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(COMMUNITY_EVENTS_ROUTE),
      element: (
        <FullAppLayout>
          <Main />
        </FullAppLayout>
      ),
      errorElement: <RouterError />,
    },
    {
      path: getAppRoute(CHAT_ROUTE),
      element: (
        <FullAppLayout>
          <Messages />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(OUR_WORLD_ROUTE),
      element: (
        <FullAppLayout>
          <AboutUs />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(SUPPORT_US_ROUTE),
      element: (
        <FullAppLayout>
          <AboutUs />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(DONATE_ROUTE),
      element: (
        <FullAppLayout>
          <AboutUs />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(RESOURCES_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(TRAININGS_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(TRAINING_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(BEGINNERS_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(LANGUAGE_RESOURCES_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(MY_STORY_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(PARTNERS_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(PARTNER_ROUTE),
      element: (
        <FullAppLayout>
          <Resources />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(MESSAGES_ROUTE),
      element: (
        <FullAppLayout>
          <Messages />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(NOTIFICATIONS_ROUTE),
      element: (
        <FullAppLayout>
          <Notifications />
        </FullAppLayout>
      ),
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
      element: (
        <FullAppLayout>
          <Help />
        </FullAppLayout>
      ),
    },
    {
      path: getAppRoute(SETTINGS_ROUTE),
      element: (
        <FullAppLayout>
          <Settings />
        </FullAppLayout>
      ),
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

  const router = createBrowserRouter(
    [
      {
        path: BASE_ROUTE,
        element: <Root includeModeSwitch />,
        children: ROOT_ROUTES,
        errorElement: (
          <Root includeModeSwitch>
            <RouterError />
          </Root>
        ),
      },
    ],
    { basename: '/' },
  );
  return router;
}

export function getNativeRouter() {
  const ROOT_ROUTES = [
    {
      path: getAppRoute(LOGIN_ROUTE),
      element: (
        <FormLayout>
          <Button>Login</Button>
          <Button>Sign Up</Button>
        </FormLayout>
      ),
      errorElement: <RouterError Layout={FormLayout} />,
    },
    {
      path: getAppRoute(''),
      element: (
        <FormLayout>
          <Button>Home</Button>
        </FormLayout>
      ),
      errorElement: <RouterError Layout={FormLayout} />,
    },
    {
      path: '*',
      element: <Navigate to="/app/login" replace />,
    },
  ];

  const router = createBrowserRouter(
    [
      {
        path: '',
        element: <Root />,
        children: ROOT_ROUTES,
        errorElement: (
          <Root>
            <RouterError />
          </Root>
        ),
      },
    ],
    { basename: '' },
  );
  return router;
}

export default getWebRouter;
