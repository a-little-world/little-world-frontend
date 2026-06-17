export const USER_FIELDS = {
  image: 'image',
  avatar: 'avatar_config',
  imageType: 'image_type',
};

export const USER_TYPES = {
  volunteer: 'volunteer',
  learner: 'learner',
};

export const MATCH_TYPES = {
  standard: 'standard',
  random_call: 'random_call',
};

export const LANGUAGES = {
  de: 'de',
  en: 'en',
  german: 'german',
  english: 'english',
};

export const COUNTRIES = {
  DE: 'DE',
};

export const LANGUAGE_LEVELS = {
  level0: 'level-0',
  level1: 'level-1',
  level2: 'level-2',
  level3: 'level-3',
  level4: 'level-4',
};

export const SEARCHING_STATES = {
  searching: 'searching',
  idle: 'idle',
};

// labelling of the data fields stored in the backend
// must stay aligned with api schema otherwise requests will fail
export const API_FIELDS = {
  email: 'email',
  password: 'password',
  password1: 'password',
  password2: 'confirmPassword',
  first_name: 'firstName',
  second_name: 'lastName',
  birth_year: 'birthYear',
  image: 'image',
  newsletter_subscribed: 'mailingList',
  token: 'token',
  reason: 'reason', // reportMatch
  other_user_uuid: 'otherUserUuid', // reportMatch
  confirm: 'acceptDeny', // confirmOrDenyMatch
  unconfirmed_match_uuid: 'matchId',
};

export const COMMUNITY_EVENT_FREQUENCIES = {
  weekly: 'weekly',
  fortnightly: 'fortnightly',
  monthly: 'monthly',
  once: 'once',
};

// Pages with height equal to the full height of the viewport.
// Entries are matched against the sub-path after /app/ (e.g. 'chat' matches
// /app/chat and /app/chat/:id; 'help/contact' matches only that exact sub-page).
export const pagesWithViewportHeight = ['chat', 'help/contact'];

export const STORAGE_KEYS = {
  themePreference: 'theme-preference',
};

/**
 * Quiz step ids sent to `/api/user/self_onboarding/update/`.
 * Built as `{chapter_id}_q_{quiz order}` — use chapter_ids `self_onboarding_c1` etc. in CMS.
 * Must match `SELF_ONBOARDING_STEP_ORDER` in `back/management/api/user.py`.
 */
export const SELF_ONBOARDING_WALKTHROUGH_STEP_IDS = [
  'self_onboarding_c1_q_1',
  'self_onboarding_c2_q_1',
  'self_onboarding_c3_q_1',
] as const;
