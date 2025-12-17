export const BASE_ROUTE = '/';
export const APP_ROUTE = 'app';
export const RANDOM_CALLS_ROUTE = 'random-calls';
export const COMMUNITY_EVENTS_ROUTE = 'events';
export const OUR_WORLD_ROUTE = 'our-world';
export const SUPPORT_US_ROUTE = 'our-world/support';
export const DONATE_ROUTE = 'our-world/donate';
export const CALL_ROUTE = 'call/:userId?/';
export const RANDOM_CALL_ROUTE = 'random-call/:userId?/';
export const CALL_SETUP_ROUTE = 'call-setup/:userId?';
export const CHAT_ROUTE = 'chat/:chatId/';
export const MESSAGES_ROUTE = 'chat';
export const NOTIFICATIONS_ROUTE = 'notifications';
export const USER_PROFILE_ROUTE = 'profile/:userId?/';
export const PROFILE_ROUTE = 'profile';
export const RESOURCES_ROUTE = 'resources';
export const PARTNERS_ROUTE = 'resources/partners';
export const PARTNER_ROUTE = 'resources/partners/:partnerSlug?/';
export const TRAININGS_ROUTE = 'resources/trainings';
export const TRAINING_ROUTE = 'resources/trainings/:trainingSlug?/';
export const BEGINNERS_ROUTE = 'resources/beginners';
export const LANGUAGE_RESOURCES_ROUTE = 'resources/german';
export const MY_STORY_ROUTE = 'resources/story';
export const HELP_ROUTE = 'help';
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
export const getAppRoute = (slug?: string) => `/${APP_ROUTE}${slug ? `/${slug}` : ''}`;
export const getAppSubpageRoute = (parent: string, slug: string) =>
  getAppRoute(`${parent}/${slug}`);
export const getCallRoute = (userId: string) => `/${APP_ROUTE}/call/${userId}`;
export const getRandomCallRoute = (userId: string) => `/${APP_ROUTE}/random-call/${userId}`;
export const getCallSetupRoute = (userId: string) =>
  `/${APP_ROUTE}/call-setup/${userId}`;

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

export const isActiveRoute = (locationPath: string, path: string) =>
  locationPath === path || path !== getAppRoute('') ?
    locationPath?.includes(path) :
    false;

// should be called when passing from unauthenticated to authenticated state
export const passAuthenticationBoundary = () => {
  try {
    if (typeof window !== 'undefined' && (window as any)?.unloadCookieBanner) {
      (window as any)?.unloadCookieBanner();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Coudn't unload cookie banner", e);
  }
};
