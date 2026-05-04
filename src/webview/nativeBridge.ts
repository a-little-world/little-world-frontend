import { DomCommunicationMessageFn } from '../features/stores/receiveHandler';

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage?: (message: string) => void;
    };
    webkit?: {
      messageHandlers?: Record<
        string,
        { postMessage?: (message: unknown) => void }
      >;
    };
  }
}

type NativeWebViewWindow = Window & typeof globalThis;

const NATIVE_BRIDGE_UNAVAILABLE_ERROR = 'Native WebView bridge not available';

function getNativeWindow(): NativeWebViewWindow | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window as NativeWebViewWindow;
}

export function hasNativeWebViewBridge(): boolean {
  const nativeWindow = getNativeWindow();

  if (!nativeWindow) {
    return false;
  }

  const hasReactNativeBridge =
    typeof nativeWindow.ReactNativeWebView?.postMessage === 'function';

  if (hasReactNativeBridge) {
    return true;
  }

  const wkMessageHandlers = nativeWindow.webkit?.messageHandlers;

  return !!wkMessageHandlers && typeof wkMessageHandlers === 'object';
}

export const nativeBridgeUnavailableResponse = {
  ok: false,
  error: NATIVE_BRIDGE_UNAVAILABLE_ERROR,
} as const;

export function createSafeNativeMessageSender(
  sendMessageToReactNative: DomCommunicationMessageFn,
): DomCommunicationMessageFn {
  return async message => {
    if (!hasNativeWebViewBridge()) {
      return nativeBridgeUnavailableResponse;
    }

    try {
      return await sendMessageToReactNative(message);
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Native WebView bridge call failed',
      };
    }
  };
}
