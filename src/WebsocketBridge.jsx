import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import {
  CORE_WS_PATH, CORE_WS_SHEME, IS_CAPACITOR_BUILD, BACKEND_URL,
} from './ENVIRONMENT';

import './App.css';

const SOCKET_URL = IS_CAPACITOR_BUILD ? (CORE_WS_SHEME + BACKEND_URL.split('//').pop() + CORE_WS_PATH) : (CORE_WS_SHEME + window.location.host + CORE_WS_PATH);

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
  const [socketUrl, setSocketUrl] = useState(SOCKET_URL);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);
      console.log('CORE SOCKET:', message);
      dispatch({
        type: `userData/${message.action}`,
        payload: message.payload,
      });
    }
  }, [dispatch, lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  console.log('SOCKET LOADED', connectionStatus);

  return null;
};

export default WebsocketBridge;
