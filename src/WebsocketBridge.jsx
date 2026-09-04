import { useEffect, useState } from 'react';

import useWebSocket from 'react-use-websocket';
import { mutate } from 'swr';

import './App.css';

import {
  NOTIFICATIONS_ENDPOINT,
  UNREAD_NOTIFICATIONS_ENDPOINT,
} from './api/endpoints';
import {
  useEffectiveBackendUrl,
  useEffectiveCoreWsScheme,
} from './api/helpers';
import { environment } from './environment';
import useNativeStore from './features/stores/nativeStore';
import { runWsBridgeMutation } from './features/swr/wsBridgeMutations';
import { getInstallationId } from './firebase-util';
import useToast from './hooks/useToast';

const WebsocketBridge = () => {
  /**
   * Esablishes a websocket connection with the backend
   * This can be used to transmit any event from server to client
   * e.g.: client data can be cahnges by sending a message like: {
   * event: "reduction",
   * payload: {...}
   * } --> this will triger a simple redux dispatch in the frontend
   */
  const [accessToken, setAccessToken] = useState(undefined);
  const [ready, setReady] = useState(false);
  const [, setMessageHistory] = useState([]);
  const [installId, setInstallId] = useState(undefined);

  const backendUrl = useEffectiveBackendUrl();
  const coreWsScheme = useEffectiveCoreWsScheme();
  const webSocketHost = new URL(backendUrl).host;
  const socketUrl =
    coreWsScheme +
    webSocketHost +
    environment.coreWsPath +
    (installId ? `?install_id=${encodeURIComponent(installId)}` : '');

  const loadAccessToken = async () => {
    const token = await useNativeStore.getState().getAccessToken();
    setAccessToken(token);
  };

  const loadInstallId = async () => {
    const id = await getInstallationId();
    setInstallId(id);
  };

  useEffect(() => {
    (async () => {
      if (environment.isNative) {
        await loadAccessToken();
      }
      await loadInstallId();
      setReady(true);
    })();
  }, []);
  const { lastMessage } = useWebSocket(ready ? socketUrl : null, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      interval: 60000,
      timeout: 150000,
    },
    // old token may have expired -> load current one
    onClose: () => {
      if (environment.isNative) loadAccessToken();
    },
    protocols:
      environment.isNative && accessToken
        ? [`bearer.${accessToken}`]
        : undefined,
  });

  const toast = useToast();

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);

      if (message.action === 'addNotification' && message.payload?.showToast) {
        const { title, description } = message.payload;
        toast.showToast({
          title,
          description,
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
  }, [lastMessage, setMessageHistory, toast]);

  return null;
};

export default WebsocketBridge;
