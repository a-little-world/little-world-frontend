import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  GlobalStyles,
  CustomThemeProvider
} from '@a-little-world/little-world-design-system';
import React, { useState, useEffect } from "react";
import styled, { css, useTheme } from 'styled-components';

const PushDebugerContainer = styled.div`
  position: absolute;
  background: red;
  height: 200px;
  width: 600px;
  bottom: 0;
  left: 0;
`;

export const PushDebuggerButton = styled(Button)`
  font-size: 1rem;
  font-weight: normal;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.small};
  width: fit-content;

  &:not(:last-of-type) {
    margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }
`;

function PushNotificationsTunnel() {
  const [inMessages, setInMessages] = useState([]);
  const [outMessages, setOutMessages] = useState([]);
  
  useEffect(() => {
    // Register the service worker
    
    const listener = event => {
      console.log('Received message from Service Worker:', event.data);
      setInMessages(prevMessages => [...prevMessages, event.data]);
    };

    self.addEventListener('message', listener);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/api/push_notifications/push_notifications_worker.js');
      console.log('Service Worker registered!');
    }else{
      console.log('Service Worker not supported!');
    }
    
    return () => {
      self.removeEventListener('message', listener);
    }
    
  }, []);
  
  const sendNotificationToServiceWorker = async () => {
    console.log('Sending message to Service Worker...');
    window.postMessage({
      type: 'notification',
      message: 'Hello from the client!',
    });
    console.log('Message sent!');
  }


  return <>
    <PushDebuggerButton
      type="button"
      variation={ButtonVariations.Basic}
      appearance={ButtonAppearance.Primary}
      onClick={sendNotificationToServiceWorker}
    >
      Send Notification to Service Worker
    </PushDebuggerButton>
  </>
}

function InteralPushDebugger(){

    const theme = useTheme();
  
    useEffect(() => {
     // listen for service worker messages 
    }, [])
    
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
          try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              alert('Push notifications permission granted!');
            } else {
              alert('Push notifications permission denied.');
            }
          } catch (error) {
            console.error('Error requesting notification permission:', error);
          }
        } else {
          alert('This browser does not support desktop notification');
        }
    };
    
    const triggerTestNotification = () => {
        if (Notification.permission === 'granted') {
        console.log("Notification permission already granted, trying to trigger one!")
          new Notification('Test Notification', {
            body: 'This is a test push notification!',
            icon: 'https://via.placeholder.com/48', // Example icon URL
          });
        } else {
          alert('Please grant notification permissions first.');
        }
      };

    return <PushDebugerContainer>
            <h1>Push Debugger</h1>
            <PushNotificationsTunnel />
            <PushDebuggerButton
              type="button"
              variation={ButtonVariations.Basic}
              appearance={ButtonAppearance.Primary}
              borderColor={theme.color.text.link}
              color={theme.color.text.link}
              onClick={requestNotificationPermission}
            >
                Request Push Permissions
            </PushDebuggerButton>
            <PushDebuggerButton
              type="button"
              variation={ButtonVariations.Basic}
              appearance={ButtonAppearance.Primary}
              borderColor={theme.color.text.link}
            onClick={triggerTestNotification}
              color={theme.color.text.link}>
                Trigger Test Push Notification
          </PushDebuggerButton>
    </PushDebugerContainer>
}

export function CustomPushDebugger() {
    
    return <CustomPushDebuggerRoot >
            <InteralPushDebugger/>
    </CustomPushDebuggerRoot>
}

function CustomPushDebuggerRoot({ children }) {

  return (
      <CustomThemeProvider>
        <GlobalStyles />
        {children}
      </CustomThemeProvider>
  );
}
