import { GlobalStyles } from "@a-little-world/little-world-design-system";
import React from "react";
import { Provider, useDispatch } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider, useLoaderData } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { getFormData } from "./api";
import store from "./app/store";
import ActiveCall from "./call";
import RouterError from "./components/blocks/ErrorView/ErrorView";
import Form from "./components/blocks/Form/Form";
import Layout from "./components/blocks/Layout/Layout";
import Welcome from "./components/blocks/Welcome/Welcome";
import Registration from "./components/views/Registration";
import { BACKEND_PATH } from "./ENVIRONMENT";
import { initialise } from "./features/userData";
import Main from "./main";
import theme from "./theme";

import "./App.css";

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Outlet />
    </ThemeProvider>
  );
};

const userFormLoader = async () => {
  console.log({ s: store.getState() });
  // const state = store.getState()
  // const data = await getFormData();

  // return JSON.parse(data.profile_data);
};

export const router = createBrowserRouter(
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
          // loader: userFormLoader,
        },
        {
          path: "sign-up",
          element: <Registration />,
          errorElement: <RouterError />,
          // loader: userFormLoader,
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
  {
    path: "*",
    element: <Root />,
  },
  { basename: `${BACKEND_PATH}/` }
);

// function HandleRoutes({ data }) {
//   const dispatch = useDispatch();
//   dispatch(initialise(data));
//   return (
//     <Router>
//       <Routes>
//         <Route path={`${BACKEND_PATH}/`}>
//           <Route index element={<Main />} />
//           <Route path="call" element={<ActiveCall />} />
//           <Route path="partners" element={<Main />} />
//           <Route path="chat" element={<Main />} />
//           <Route path="notifications" element={<Main />} />
//           <Route path="profile" element={<Main />} />
//           <Route path="help" element={<Main />} />
//           <Route path="settings" element={<Main />} />
//           <Route path="*" element="404" />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}

function App({ data }) {
  console.log({ data });
  return (
    <Provider store={store}>
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
