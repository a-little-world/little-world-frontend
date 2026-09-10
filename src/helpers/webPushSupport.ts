/**
 * Web push is only reliable in a real browser (or an iOS home-screen PWA).
 * In-app browsers — especially Google/Facebook/Instagram on iOS — stub
 * Notification / PushManager / serviceWorker well enough that Firebase's
 * isSupported() can return true, then getMessaging()/getToken() recurse
 * until the page hits Maximum call stack size exceeded.
 */

const IN_APP_BROWSER_UA =
  /GSA\/|GoogleApp|FBAN|FBAV|Instagram|Line\/|TikTok|Twitter|Snapchat|LinkedInApp|wv\)/i;

export function isLikelyInAppBrowser(
  userAgent: string = typeof navigator === 'undefined'
    ? ''
    : navigator.userAgent,
): boolean {
  return IN_APP_BROWSER_UA.test(userAgent);
}

export function isIOS(
  userAgent: string = typeof navigator === 'undefined'
    ? ''
    : navigator.userAgent,
  platform: string = typeof navigator === 'undefined' ? '' : navigator.platform,
  maxTouchPoints: number = typeof navigator === 'undefined'
    ? 0
    : navigator.maxTouchPoints,
): boolean {
  return (
    /iP(ad|hone|od)/.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  );
}

export function isStandaloneDisplay(
  mediaMatches: (query: string) => boolean = query =>
    typeof window !== 'undefined' && window.matchMedia(query).matches,
  navigatorStandalone: boolean | undefined = typeof navigator === 'undefined'
    ? undefined
    : (navigator as Navigator & { standalone?: boolean }).standalone,
): boolean {
  return (
    mediaMatches('(display-mode: standalone)') ||
    mediaMatches('(display-mode: fullscreen)') ||
    Boolean(navigatorStandalone)
  );
}

export function canUseWebPush(options?: {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
  hasServiceWorker?: boolean;
  hasNotification?: boolean;
  hasPushManager?: boolean;
  isStandalone?: boolean;
}): boolean {
  const userAgent =
    options?.userAgent ??
    (typeof navigator === 'undefined' ? '' : navigator.userAgent);
  const platform =
    options?.platform ??
    (typeof navigator === 'undefined' ? '' : navigator.platform);
  const maxTouchPoints =
    options?.maxTouchPoints ??
    (typeof navigator === 'undefined' ? 0 : navigator.maxTouchPoints);
  const hasServiceWorker =
    options?.hasServiceWorker ??
    (typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker != null);
  const hasNotification =
    options?.hasNotification ?? typeof Notification !== 'undefined';
  const hasPushManager =
    options?.hasPushManager ??
    (typeof window !== 'undefined' && 'PushManager' in window);
  const standalone = options?.isStandalone ?? isStandaloneDisplay();

  if (!hasServiceWorker || !hasNotification || !hasPushManager) {
    return false;
  }
  if (isLikelyInAppBrowser(userAgent)) {
    return false;
  }
  // iOS web push only works for home-screen PWAs, not Safari or in-app WebViews.
  if (isIOS(userAgent, platform, maxTouchPoints) && !standalone) {
    return false;
  }
  return true;
}

export function getNotificationPermission():
  | 'default'
  | 'denied'
  | 'granted'
  | undefined {
  try {
    if (typeof Notification === 'undefined') {
      return undefined;
    }
    return Notification.permission;
  } catch {
    return undefined;
  }
}
