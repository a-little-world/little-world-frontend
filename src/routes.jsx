export const BASE_ROUTE = "/";
export const CALL_ROUTE = "call";
export const PARTNERS_ROUTE = "partners";
export const CHAT_ROUTE = "chat";
export const NOTIFICATIONS_ROUTE = "notifications";
export const PROFILE_ROUTE = "profile";
export const HELP_ROUTE = "help";
export const SETTINGS_ROUTE = "settings";
export const LOGIN_ROUTE = "login";
export const SIGN_UP_ROUTE = "sign-up";
export const FORGOT_PASSWORD_ROUTE = "forgot-password";
export const RESET_PASSWORD_ROUTE = "reset-password";
export const USER_FORM_ROUTE = "user-form";
export const WP_HOME_ROUTE = "https://home.little-world.com";
export const TERMS_ROUTE = "nutzungsbedingungen";
export const PRIVACY_ROUTE = "datenschutz";

export const getHomeRoute = (locale, slug) => `${WP_HOME_ROUTE}/${locale}/${slug}`;
