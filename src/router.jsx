import { GlobalStyles } from "@a-little-world/little-world-design-system";
import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import ActiveCall from "./call";
import RouterError from "./components/blocks/ErrorView/ErrorView";
import Form from "./components/blocks/Form/Form";
import Layout from "./components/blocks/Layout/Layout";
import Welcome from "./components/blocks/Welcome/Welcome";
import ForgotPassword from "./components/views/ForgotPassword";
import Registration from "./components/views/Registration";
import ResetPassword from "./components/views/ResetPassword";
import { BACKEND_PATH } from "./ENVIRONMENT";
import Main from "./main";
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
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <Main />,
        },
        {
          path: "call",
          element: <ActiveCall />,
        },
        {
          path: "partners",
          element: <Main />,
        },
        {
          path: "chat",
          element: <Main />,
        },
        {
          path: "notifications",
          element: <Main />,
        },
        {
          path: "profile",
          element: <Main />,
        },
        {
          path: "help",
          element: <Main />,
        },
        {
          path: "settings",
          element: <Main />,
        },
        {
          path: "login",
          element: <Registration />,
          errorElement: <RouterError />,
        },
        {
          path: "sign-up",
          element: <Registration />,
          errorElement: <RouterError />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
          errorElement: <RouterError />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
          errorElement: <RouterError />,
        },
        {
          path: "user-form",
          element: <Layout />,
          errorElement: <RouterError />,
          loader: userFormLoader,
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
  { basename: `${BACKEND_PATH}/` }
);

export default router;
