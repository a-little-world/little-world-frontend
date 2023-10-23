import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";

import store from "./app/store";
import { initialise } from "./features/userData";
import router from "./router";

import "./App.css";

const SESSION_COOKIE = "sessionid";

function InitializeDux({ data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const sessionCookie = Cookies.get(SESSION_COOKIE);
    console.log("ACCOUNT LOADER", { sessionCookie }, Cookies.get());
  });
  // if (sessionCookie) {
  //   return redirect("/");
  // }
  dispatch(initialise(data));
}

function App({ data }) {
  return (
    <Provider store={store}>
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
