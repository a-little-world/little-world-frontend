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
import WebsocketBridge from '../WebsocketBridge';
import RouterError from '../components/blocks/ErrorView/ErrorView';
import Form from '../components/blocks/Form/Form';
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
import LoadingPage from '../components/views/Loading';
import Login from '../components/views/Login';
import Messages from '../components/views/Messages';
import NativeMessageHandler from '../components/views/NativeMessageHandler';
import Notifications from '../components/views/Notifications';
import OnboardingSelection from '../components/views/Onboarding/OnboardingSelection';
import OnboardingWalkthrough from '../components/views/Onboarding/OnboardingWalkthrough';
import Profile from '../components/views/Profile';
import ResetPassword from '../components/views/ResetPassword';
import Resources from '../components/views/Resources/Resources';
import Training from '../components/views/Resources/Trainings/Training';
import Settings from '../components/views/Settings';
import SignUp from '../components/views/SignUp';
import VerifyEmail from '../components/views/VerifyEmail';
import VideoCall from '../components/views/VideoCall';
import { STORAGE_KEYS } from '../constants';
import { environment } from '../environment';
import AuthGuard from '../guards/AuthGuard';
import RouteGuard from '../guards/RouteGuard';
import { getLocalStorageItem } from '../helpers/localStorage';
import useErrorDebugBridge from '../webview/useErrorDebugBridge';
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
  HELP_CONTACT_ROUTE,
  HELP_FAQS_ROUTE,
  HELP_ROUTE,
  LANGUAGE_RESOURCES_ROUTE,
  LOGIN_ROUTE,
  MESSAGES_ROUTE,
  MY_STORY_ROUTE,
  NOTIFICATIONS_ROUTE,
  ONBOARDING_ROUTE,
  OUR_WORLD_ROUTE,
  PARTNERS_ROUTE,
  PARTNER_ROUTE,
  RANDOM_CALLS_ROUTE,
  RANDOM_CALL_ROUTE,
  RESET_PASSWORD_ROUTE,
  RESOURCES_ROUTE,
  SELF_ONBOARDING_ROUTE,
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

export const Root = ({ children, restoreScroll = true }) => {
  useErrorDebugBridge();
  return (
    <CustomThemeProvider defaultMode={getInitialTheme()}>
      <ToastProvider>
        <AuthGuard>
          <WebsocketBridge />
          {!environment.isNative && <FireBase />}
        </AuthGuard>
        {restoreScroll && <ScrollRestoration />}
        <GlobalStyles />
        {environment.isNative && <NativeMessageHandler />}
        {children || <Outlet />}
      </ToastProvider>
    </CustomThemeProvider>
  );
};

export function getWebRouter() {
  const ROOT_ROUTES = [
    // Unguarded — accessible regardless of auth state
    {
      path: EMAIL_PREFERENCES_ROUTE,
      element: (
        <FormLayout>
          <EmailPreferences />
        </FormLayout>
      ),
      errorElement: <RouterError Layout={FormLayout} />,
    },

    // Public routes — redirect to /app if already authenticated
    {
      element: <RouteGuard authRequired={false} Layout={FormLayout} />,
      errorElement: <RouterError Layout={FormLayout} />,
      children: [
        { path: LOGIN_ROUTE, element: <Login /> },
        { path: SIGN_UP_ROUTE, element: <SignUp /> },
        { path: FORGOT_PASSWORD_ROUTE, element: <ForgotPassword /> },
        { path: RESET_PASSWORD_ROUTE, element: <ResetPassword /> },
      ],
    },

    // Protected + FormLayout
    {
      element: <RouteGuard Layout={FormLayout} />,
      errorElement: <RouterError Layout={FormLayout} />,
      children: [
        { path: getAppRoute(VERIFY_EMAIL_ROUTE), element: <VerifyEmail /> },
        { path: getAppRoute(CHANGE_EMAIL_ROUTE), element: <ChangeEmail /> },
        {
          path: getAppRoute(ONBOARDING_ROUTE),
          element: <OnboardingSelection />,
        },
        {
          path: getAppRoute(SELF_ONBOARDING_ROUTE),
          element: <OnboardingWalkthrough />,
        },
        {
          path: USER_FORM_ROUTE,
          children: [
            { path: '', element: <Welcome /> },
            { path: ':slug', element: <Form /> },
          ],
        },
        {
          path: getAppRoute(USER_FORM_ROUTE),
          children: [
            { path: '', element: <Welcome /> },
            { path: ':slug', element: <Form /> },
          ],
        },
      ],
    },

    // Protected + no layout
    {
      element: <RouteGuard Layout={null} />,
      children: [
        { path: getAppRoute(CALL_ROUTE), element: <VideoCall /> },
        { path: getAppRoute(RANDOM_CALL_ROUTE), element: <VideoCall /> },
      ],
    },

    // Protected + FullAppLayout
    {
      element: <RouteGuard />,
      errorElement: <RouterError />,
      children: [
        { path: APP_ROUTE, element: <Main /> },
        { path: `${APP_ROUTE}/:id`, element: <RouterError /> },
        {
          path: getAppRoute(EDIT_FORM_ROUTE),
          children: [{ path: ':slug', element: <EditView /> }],
        },
        { path: getAppRoute(CALL_SETUP_ROUTE), element: <Main /> },
        { path: getAppRoute(COMMUNITY_EVENTS_ROUTE), element: <Main /> },
        { path: getAppRoute(RANDOM_CALLS_ROUTE), element: <Main /> },
        { path: getAppRoute(CHAT_ROUTE), element: <Messages /> },
        { path: getAppRoute(OUR_WORLD_ROUTE), element: <AboutUs /> },
        { path: getAppRoute(SUPPORT_US_ROUTE), element: <AboutUs /> },
        { path: getAppRoute(DONATE_ROUTE), element: <AboutUs /> },
        { path: getAppRoute(TRAINING_ROUTE), element: <Training /> },
        { path: getAppRoute(RESOURCES_ROUTE), element: <Resources /> },
        { path: getAppRoute(TRAININGS_ROUTE), element: <Resources /> },
        { path: getAppRoute(BEGINNERS_ROUTE), element: <Resources /> },
        { path: getAppRoute(LANGUAGE_RESOURCES_ROUTE), element: <Resources /> },
        { path: getAppRoute(MY_STORY_ROUTE), element: <Resources /> },
        { path: getAppRoute(PARTNERS_ROUTE), element: <Resources /> },
        { path: getAppRoute(PARTNER_ROUTE), element: <Resources /> },
        { path: getAppRoute(MESSAGES_ROUTE), element: <Messages /> },
        { path: getAppRoute(NOTIFICATIONS_ROUTE), element: <Notifications /> },
        { path: getAppRoute(USER_PROFILE_ROUTE), element: <Profile /> },
        {
          // Legacy / bookmarked `/app/help` → default help subpage (no standalone help index).
          path: getAppRoute(HELP_ROUTE),
          element: <Navigate to={getAppRoute(HELP_CONTACT_ROUTE)} replace />,
        },
        { path: getAppRoute(HELP_CONTACT_ROUTE), element: <Help /> },
        { path: getAppRoute(HELP_FAQS_ROUTE), element: <Help /> },
        { path: getAppRoute(SETTINGS_ROUTE), element: <Settings /> },
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
    // Unguarded — accessible regardless of auth state
    {
      path: EMAIL_PREFERENCES_ROUTE,
      element: (
        <FormLayout>
          <EmailPreferences />
        </FormLayout>
      ),
      errorElement: <RouterError Layout={FormLayout} />,
    },

    // Public routes — redirect to /app if already authenticated
    {
      element: <RouteGuard authRequired={false} Layout={FormLayout} />,
      errorElement: <RouterError Layout={FormLayout} />,
      children: [
        { path: LOGIN_ROUTE, element: <Login /> },
        { path: '', element: <LoadingPage /> },
        { path: '/', element: <LoadingPage /> },
        { path: SIGN_UP_ROUTE, element: <SignUp /> },
        { path: FORGOT_PASSWORD_ROUTE, element: <ForgotPassword /> },
        { path: RESET_PASSWORD_ROUTE, element: <ResetPassword /> },
      ],
    },

    // Protected + FormLayout
    {
      element: <RouteGuard Layout={FormLayout} />,
      errorElement: <RouterError Layout={FormLayout} />,
      children: [
        { path: getAppRoute(VERIFY_EMAIL_ROUTE), element: <VerifyEmail /> },
        { path: getAppRoute(CHANGE_EMAIL_ROUTE), element: <ChangeEmail /> },
        {
          path: getAppRoute(ONBOARDING_ROUTE),
          element: <OnboardingSelection />,
        },
        {
          path: getAppRoute(SELF_ONBOARDING_ROUTE),
          element: <OnboardingWalkthrough />,
        },
        {
          path: getAppRoute(USER_FORM_ROUTE),
          children: [
            { path: '', element: <Welcome /> },
            { path: ':slug', element: <Form /> },
          ],
        },
      ],
    },

    // Protected + no layout
    {
      element: <RouteGuard Layout={null} />,
      children: [
        { path: getAppRoute(CALL_ROUTE), element: <VideoCall /> },
        { path: getAppRoute(RANDOM_CALL_ROUTE), element: <VideoCall /> },
      ],
    },

    // Protected + FullAppLayout
    {
      element: <RouteGuard />,
      errorElement: <RouterError />,
      children: [
        { path: APP_ROUTE, element: <Main /> },
        {
          path: getAppRoute(EDIT_FORM_ROUTE),
          children: [{ path: ':slug', element: <EditView /> }],
        },
        { path: getAppRoute(COMMUNITY_EVENTS_ROUTE), element: <Main /> },
        { path: getAppRoute(RANDOM_CALLS_ROUTE), element: <Main /> },
        { path: getAppRoute(CHAT_ROUTE), element: <Messages /> },
        { path: getAppRoute(OUR_WORLD_ROUTE), element: <AboutUs /> },
        { path: getAppRoute(SUPPORT_US_ROUTE), element: <AboutUs /> },
        { path: getAppRoute(DONATE_ROUTE), element: <AboutUs /> },
        { path: getAppRoute(TRAINING_ROUTE), element: <Training /> },
        { path: getAppRoute(RESOURCES_ROUTE), element: <Resources /> },
        { path: getAppRoute(TRAININGS_ROUTE), element: <Resources /> },
        { path: getAppRoute(BEGINNERS_ROUTE), element: <Resources /> },
        { path: getAppRoute(LANGUAGE_RESOURCES_ROUTE), element: <Resources /> },
        { path: getAppRoute(MY_STORY_ROUTE), element: <Resources /> },
        { path: getAppRoute(PARTNERS_ROUTE), element: <Resources /> },
        { path: getAppRoute(PARTNER_ROUTE), element: <Resources /> },
        { path: getAppRoute(MESSAGES_ROUTE), element: <Messages /> },
        { path: getAppRoute(NOTIFICATIONS_ROUTE), element: <Notifications /> },
        { path: getAppRoute(USER_PROFILE_ROUTE), element: <Profile /> },
        {
          // Legacy / bookmarked `/app/help` → default help subpage (no standalone help index).
          path: getAppRoute(HELP_ROUTE),
          element: <Navigate to={getAppRoute(HELP_CONTACT_ROUTE)} replace />,
        },
        { path: getAppRoute(HELP_CONTACT_ROUTE), element: <Help /> },
        { path: getAppRoute(HELP_FAQS_ROUTE), element: <Help /> },
        { path: getAppRoute(SETTINGS_ROUTE), element: <Settings /> },
      ],
    },

    { path: '*', element: <Navigate to="/" replace /> },
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
