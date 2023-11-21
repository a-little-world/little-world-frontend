import { GlobalStyles } from "@a-little-world/little-world-design-system";
import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import ActiveCall from "./call";
import RouterError from "./components/blocks/ErrorView/ErrorView";
import Form from "./components/blocks/Form/Form";
import FormLayout from "./components/blocks/Layout/FormLayout";
import Welcome from "./components/blocks/Welcome/Welcome";
import ChangeEmail from "./components/views/ChangeEmail";
import ForgotPassword from "./components/views/ForgotPassword";
import Login from "./components/views/Login";
import ResetPassword from "./components/views/ResetPassword";
import SignUp from "./components/views/SignUp";
import VerifyEmail from "./components/views/VerifyEmail";
import Main from "./main";
import {
  APP_ROUTE,
  BASE_ROUTE,
  CALL_ROUTE,
  CHANGE_EMAIL_ROUTE,
  CHAT_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  getAppRoute,
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
} from "./routes";
import theme from "./theme";

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Outlet />
    </ThemeProvider>
  );
};

const router = createBrowserRouter(
  [
    {
      path: BASE_ROUTE,
      element: <Root />,
      children: [
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
          path: VERIFY_EMAIL_ROUTE,
          element: (
            <FormLayout>
              <VerifyEmail />
            </FormLayout>
          ),
          errorElement: <RouterError />,
        },
        {
          path: CHANGE_EMAIL_ROUTE,
          element: (
            <FormLayout>
              <ChangeEmail />
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
              path: "",
              element: <Welcome />,
            },
            {
              path: ":slug",
              element: <Form />,
            },
          ],
        },
        {
          path: APP_ROUTE,
          element: <Main />,
        },
        {
          path: getAppRoute(CALL_ROUTE),
          element: <ActiveCall />,
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
              path: "",
              element: <Welcome />,
            },
            {
              path: ":slug",
              element: <Form />,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/" }
);

export default router;
