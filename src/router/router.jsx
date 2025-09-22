import {
  CustomThemeProvider,
  GlobalStyles,
  ThemeVariants,
} from '@a-little-world/little-world-design-system';
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom';

import FireBase from '../Firebase';
import WebsocketBridge from '../WebsocketBridge.jsx';
import RouterError from '../components/blocks/ErrorView/ErrorView.tsx';
import Form from '../components/blocks/Form/Form.jsx';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout.tsx';
import FormLayout from '../components/blocks/Layout/FormLayout.jsx';
import { ToastProvider } from '../components/blocks/Toast.tsx';
import Welcome from '../components/blocks/Welcome/Welcome.jsx';
import AboutUs from '../components/views/AboutUs/AboutUs.tsx';
import ChangeEmail from '../components/views/ChangeEmail.jsx';
import EditView from '../components/views/Edit.jsx';
import EmailPreferences from '../components/views/EmailPreferences.tsx';
import ForgotPassword from '../components/views/ForgotPassword.jsx';
import Help from '../components/views/Help.tsx';
import Main from '../components/views/Home.tsx';
import Login from '../components/views/Login.jsx';
import Messages from '../components/views/Messages.jsx';
import Notifications from '../components/views/Notifications.tsx';
import Profile from '../components/views/Profile.tsx';
import ResetPassword from '../components/views/ResetPassword.jsx';
import Resources from '../components/views/Resources/Resources.tsx';
import Settings from '../components/views/Settings.jsx';
import SignUp from '../components/views/SignUp.jsx';
import VerifyEmail from '../components/views/VerifyEmail.jsx';
import VideoCall from '../components/views/VideoCall';
import { STORAGE_KEYS } from '../constants/index.ts';
import AuthGuard from '../guards/AuthGuard.tsx';
import { getLocalStorageItem } from '../helpers/localStorage.ts';
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

const getInitialTheme = () => {
  const storedTheme = getLocalStorageItem(STORAGE_KEYS.themePreference);
  if (
    storedTheme === ThemeVariants.dark ||
    storedTheme === ThemeVariants.light
  ) {
    return storedTheme;
  }
  return undefined; // Let CustomThemeProvider use its default
};

export const Root = ({ children, restoreScroll = true }) => (
  <CustomThemeProvider defaultMode={getInitialTheme()}>
    <ToastProvider>
      <AuthGuard>
        <WebsocketBridge />
        <FireBase />
      </AuthGuard>
      {restoreScroll && <ScrollRestoration />}
      <GlobalStyles />
      {children || <Outlet />}
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
  return router;
}

export function getNativeRouter() {
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
      path: '',
      element: (
        <FormLayout>
          <Login />
        </FormLayout>
      ),
      errorElement: <RouterError Layout={FormLayout} />,
    },
    {
      path: '/',
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
      path: APP_ROUTE,
      element: (
        <FullAppLayout>
          <Main />
        </FullAppLayout>
      ),
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
      path: getAppRoute(USER_PROFILE_ROUTE),
      element: (
        <FullAppLayout>
          <Profile />
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
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  const router = createHashRouter(
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
