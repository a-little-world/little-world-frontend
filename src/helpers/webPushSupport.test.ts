import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  canUseWebPush,
  isIOS,
  isLikelyInAppBrowser,
  isStandaloneDisplay,
} from './webPushSupport.ts';

const chromeAndroid =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const iosSafari =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const iosGoogleApp =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/323.0.646032090 Mobile/15E148 Safari/604.1';
const iosInstagram =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 192.168.1.2.111';

const capable = {
  hasServiceWorker: true,
  hasNotification: true,
  hasPushManager: true,
};

describe('isLikelyInAppBrowser', () => {
  it('detects the iOS Google in-app browser', () => {
    assert.equal(isLikelyInAppBrowser(iosGoogleApp), true);
  });

  it('detects Instagram in-app browser', () => {
    assert.equal(isLikelyInAppBrowser(iosInstagram), true);
  });

  it('does not flag Safari or Chrome', () => {
    assert.equal(isLikelyInAppBrowser(iosSafari), false);
    assert.equal(isLikelyInAppBrowser(chromeAndroid), false);
  });
});

describe('isIOS', () => {
  it('detects iPhone user agents', () => {
    assert.equal(isIOS(iosSafari, 'iPhone', 5), true);
  });

  it('detects iPadOS desktop-UA iPads', () => {
    assert.equal(
      isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 5),
      true,
    );
  });

  it('does not flag Android', () => {
    assert.equal(isIOS(chromeAndroid, 'Linux armv81', 5), false);
  });
});

describe('isStandaloneDisplay', () => {
  it('is true for standalone display-mode', () => {
    assert.equal(
      isStandaloneDisplay(query => query.includes('standalone'), false),
      true,
    );
  });

  it('is true for iOS navigator.standalone', () => {
    assert.equal(
      isStandaloneDisplay(() => false, true),
      true,
    );
  });

  it('is false in a normal browser tab', () => {
    assert.equal(
      isStandaloneDisplay(() => false, false),
      false,
    );
  });
});

describe('canUseWebPush', () => {
  it('allows a capable desktop/Android browser', () => {
    assert.equal(
      canUseWebPush({
        ...capable,
        userAgent: chromeAndroid,
        platform: 'Linux armv81',
        maxTouchPoints: 5,
        isStandalone: false,
      }),
      true,
    );
  });

  it('rejects the iOS Google in-app browser even when push APIs are stubbed', () => {
    assert.equal(
      canUseWebPush({
        ...capable,
        userAgent: iosGoogleApp,
        platform: 'iPhone',
        maxTouchPoints: 5,
        isStandalone: false,
      }),
      false,
    );
  });

  it('rejects iOS Safari that is not a home-screen PWA', () => {
    assert.equal(
      canUseWebPush({
        ...capable,
        userAgent: iosSafari,
        platform: 'iPhone',
        maxTouchPoints: 5,
        isStandalone: false,
      }),
      false,
    );
  });

  it('allows an iOS home-screen PWA', () => {
    assert.equal(
      canUseWebPush({
        ...capable,
        userAgent: iosSafari,
        platform: 'iPhone',
        maxTouchPoints: 5,
        isStandalone: true,
      }),
      true,
    );
  });

  it('rejects browsers missing service worker or Notification', () => {
    assert.equal(
      canUseWebPush({
        ...capable,
        hasServiceWorker: false,
        userAgent: chromeAndroid,
        isStandalone: false,
      }),
      false,
    );
    assert.equal(
      canUseWebPush({
        ...capable,
        hasNotification: false,
        userAgent: chromeAndroid,
        isStandalone: false,
      }),
      false,
    );
  });
});
