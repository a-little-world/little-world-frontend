export const BASE_ROUTE = '/';
export const APP_ROUTE = 'app';
export const RANDOM_CALLS_ROUTE = 'random-calls';
export const COMMUNITY_EVENTS_ROUTE = 'events';
export const OUR_WORLD_ROUTE = 'our-world';
export const SUPPORT_US_ROUTE = 'our-world/support';
export const DONATE_ROUTE = 'our-world/donate';
export const MATERIALS_ROUTE = 'our-world/materials';
export const CALL_ROUTE = 'call/:userId?/';
export const RANDOM_CALL_ROUTE = 'random-call/:userId?/';
export const CALL_SETUP_ROUTE = 'call-setup/:userId?';
export const CHAT_ROUTE = 'chat/:chatId/';
export const MESSAGES_ROUTE = 'chat';
export const NOTIFICATIONS_ROUTE = 'notifications';
export const USER_PROFILE_ROUTE = 'profile/:userId?/';
export const MATCH_OVERVIEW_ROUTE = 'match/:id';
export const PROFILE_ROUTE = 'profile';
export const RESOURCES_ROUTE = 'resources';
export const PARTNERS_ROUTE = 'resources/partners';
export const PARTNER_ROUTE = 'resources/partners/:partnerSlug?/';
export const TRAININGS_ROUTE = 'resources/trainings';
export const TRAINING_ROUTE = 'resources/trainings/:trainingSlug';
export const COURSE_PREVIEW_ROUTE = 'courses/preview/:courseSlug';

export const getCoursePreviewRoute = (slug: string) =>
  getAppRoute(`courses/preview/${slug}`);
export const BEGINNERS_ROUTE = 'resources/beginners';
export const LANGUAGE_RESOURCES_ROUTE = 'resources/german';
export const MY_STORY_ROUTE = 'resources/story';
/** Redirect-only; link to HELP_CONTACT_ROUTE or HELP_FAQS_ROUTE instead. */
export const HELP_ROUTE = 'help';
export const HELP_CONTACT_ROUTE = 'help/contact';
export const HELP_FAQS_ROUTE = 'help/faqs';
export const SETTINGS_ROUTE = 'settings';
export const LOGIN_ROUTE = 'login';
export const SIGN_UP_ROUTE = 'sign-up';
export const CHANGE_EMAIL_ROUTE = 'change-email';
export const VERIFY_EMAIL_ROUTE = 'verify-email';
export const FORGOT_PASSWORD_ROUTE = 'forgot-password';
export const RESET_PASSWORD_ROUTE = 'reset-password/:userId/:token';
export const EDIT_FORM_ROUTE = 'edit';
export const USER_FORM_ROUTE = 'user-form';
export const WP_HOME_ROUTE = 'https://home.little-world.com';
export const TERMS_ROUTE = 'nutzungsbedingungen';
export const PRIVACY_ROUTE = 'datenschutz';
export const EMAIL_PREFERENCES_ROUTE = 'email-preferences/:emailSettingsHash';
export const ONBOARDING_ROUTE = 'onboarding';
export const SELF_ONBOARDING_ROUTE = 'onboarding/walkthrough';

// User form specific route slugs
export const USER_FORM_USER_TYPE = 'user-type';
export const USER_FORM_SELF_INFO_1 = 'self-info-1';
export const USER_FORM_INTERESTS = 'interests';
export const USER_FORM_PICTURE = 'picture';
export const USER_FORM_PARTNER_1 = 'partner-1';
export const USER_FORM_AVAILABILITY = 'availability';
export const USER_FORM_NOTIFICATIONS = 'notifications';
export const USER_FORM_CONDITIONS = 'conditions';

// Helper function to generate routes
const getUserFormRoute = (slug: string) => `${USER_FORM_ROUTE}/${slug}`;
export const getHomeRoute = (locale: string, slug: string) =>
  `${WP_HOME_ROUTE}/${locale}/${slug}`;
export const getAppRoute = (slug?: string) =>
  `/${APP_ROUTE}${slug ? `/${slug}` : ''}`;
export const getAppAbsoluteRoute = (slug?: string) =>
  `${window.location.origin}${getAppRoute(slug)}`;
export const getAppSubpageRoute = (parent: string, slug: string) =>
  getAppRoute(`${parent}/${slug}`);
export const getCallRoute = (userId: string) => `/${APP_ROUTE}/call/${userId}`;
export const getRandomCallRoute = (userId: string) =>
  `/${APP_ROUTE}/random-call/${userId}`;
export const getCallSetupRoute = (userId: string) =>
  `/${APP_ROUTE}/call-setup/${userId}`;
export const getMatchOverviewRoute = (matchId: string) =>
  getAppRoute(`match/${matchId}`);

export const USER_FORM_ROUTES = {
  USER_TYPE: getUserFormRoute(USER_FORM_USER_TYPE),
  SELF_INFO_1: getUserFormRoute(USER_FORM_SELF_INFO_1),
  INTERESTS: getUserFormRoute(USER_FORM_INTERESTS),
  PICTURE: getUserFormRoute(USER_FORM_PICTURE),
  PARTNER_1: getUserFormRoute(USER_FORM_PARTNER_1),
  AVAILABILITY: getUserFormRoute(USER_FORM_AVAILABILITY),
  NOTIFICATIONS: getUserFormRoute(USER_FORM_NOTIFICATIONS),
  CONDITIONS: getUserFormRoute(USER_FORM_CONDITIONS),
};

/** True when pathname is exactly `path` or a nested route under it (e.g. `/app/help/faqs` under `/app/help`). */
export const isActiveRoute = (locationPath: string, path: string) => {
  const appHome = getAppRoute('');

  if (!path || path === appHome) {
    return locationPath === appHome;
  }

  return locationPath === path || locationPath.startsWith(`${path}/`);
};

const COOKIE_BANNER_HIDE_RETRY_INTERVAL_MS = 100;
const COOKIE_BANNER_HIDE_RETRY_TIMEOUT_MS = 10000;

let cookieBannerHideRetryTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Hides the cookie banner in the authenticated app.
 *
 * The banner is injected as an async script on public pages and only defines
 * `window.setCookieBannerHidden` once it loads. A login and SPA navigation can
 * easily win that race (notably on Safari), leaving the banner visible over the
 * app. Remembering the request on `window.__lwCookieBannerHidden` makes the
 * async bundle honor it, and the retry covers a bundle that is not loaded yet.
 */
export const hideCookieBanner = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const win = window as any;
    // eslint-disable-next-line no-underscore-dangle
    win.__lwCookieBannerHidden = true;

    const applyHidden = () => {
      if (typeof win.setCookieBannerHidden === 'function') {
        win.setCookieBannerHidden(true);
        return true;
      }
      return false;
    };

    if (applyHidden() || cookieBannerHideRetryTimer !== null) {
      return;
    }

    const startedAt = Date.now();
    cookieBannerHideRetryTimer = setInterval(() => {
      if (
        applyHidden() ||
        Date.now() - startedAt >= COOKIE_BANNER_HIDE_RETRY_TIMEOUT_MS
      ) {
        if (cookieBannerHideRetryTimer !== null) {
          clearInterval(cookieBannerHideRetryTimer);
          cookieBannerHideRetryTimer = null;
        }
      }
    }, COOKIE_BANNER_HIDE_RETRY_INTERVAL_MS);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Coudn't unload cookie banner", e);
  }
};

// should be called when passing from unauthenticated to authenticated state
export const passAuthenticationBoundary = () => {
  hideCookieBanner();
};
