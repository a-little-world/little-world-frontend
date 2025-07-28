import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { mutate } from 'swr';

import './App.css';
import { environment } from './environment';
import {
  NOTIFICATIONS_ENDPOINT,
  UNREAD_NOTIFICATIONS_ENDPOINT,
} from './features/swr/index';
import { runWsBridgeMutation } from './features/swr/wsBridgeMutations';
import useToast from './hooks/useToast';

const window = undefined;

const SOCKET_URL = environment.isCapacitorBuild ?
  environment.coreWsScheme +
    environment.backendUrl.split('//').pop() +
    environment.coreWsPath :
  environment.coreWsScheme + (window?.location.host || '') + environment.coreWsPath;

const WebsocketBridge = () => {
  /**
   * Esablishes a websocket connection with the backend
   * This can be used to transmit any event from server to client
   * e.g.: client data can be cahnges by sending a message like: {
   * event: "reduction",
   * payload: {...}
   * } --> this will triger a simple redux dispatch in the frontend
   */
  const [socketUrl] = useState(SOCKET_URL);
  const [, setMessageHistory] = useState([]);
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
  });

  const toast = useToast();

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);
      console.log('CORE SOCKET:', message);

      if (message.action === 'addNotification' && message.payload?.showToast) {
        const { headline, title, description, created_at } = message.payload;
        toast.showToast({
          headline,
          title,
          description,
          timestamp: new Date(created_at).toLocaleTimeString(),
        });

        // TODO: only if message is also persisted
        // TODO: don't mutate the api via fetch rather just update the store
        mutate(UNREAD_NOTIFICATIONS_ENDPOINT);
        mutate(NOTIFICATIONS_ENDPOINT);
      }

      try {
        runWsBridgeMutation(message.action, message.payload);
      } catch (e) {
        console.warn('CORE SOCKET ERROR:', e);
      }
    }
  }, [lastMessage, setMessageHistory]);

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
