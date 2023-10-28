import React from "react";
import { Provider, useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState } from "react";

import store from "./app/store";
import { initialise } from "./features/userData";
import router from "./router";
import { CORE_WS_PATH } from "./ENVIRONMENT";

import "./App.css";

function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}


const WebsocketBridge = () => {
  /**
   * Esablishes a websocket connection with the backend
   * This can be used to transmit any event from server to client
   * e.g.: client data can be cahnges by sending a message like: {
   * event: "reduction",
   * payload: {...} 
   * } --> this will triger a simple redux dispatch in the frontend
   */
  const dispatch = useDispatch();
  const [socketUrl, setSocketUrl] = useState(CORE_WS_PATH);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);
      if (message.event === "reduction") {
        dispatch({
          type: message.payload.action,
          payload: message.payload.payload,
        });
      }
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  console.log("SOCKET LOADED", connectionStatus);

  return <div style={{
    visibility: "hidden"
  }}>{connectionStatus}</div>;
};

function App({ data }) {
  return (
    <Provider store={store}>
      <InitializeDux data={data} />
      <WebsocketBridge />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
