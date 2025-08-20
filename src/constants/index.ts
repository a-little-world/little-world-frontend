export const USER_FIELDS = {
  image: 'image',
  avatar: 'avatar_config',
  imageType: 'image_type',
};

export const USER_TYPES = {
  volunteer: 'volunteer',
  learner: 'learner',
};

export const LANGUAGES = {
  de: 'de',
  en: 'en',
  german: 'german',
  english: 'english',
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
  other_user_hash: 'otherUserHash', // reportMatch
  confirm: 'acceptDeny', // partiallyConfirmMatch
  unconfirmed_match_hash: 'matchId', // partiallyConfirmMatch
};

export const COMMUNITY_EVENT_FREQUENCIES = {
  weekly: 'weekly',
  fortnightly: 'fortnightly',
  monthly: 'monthly',
  once: 'once',
};

// Pages with height equal to the full height of the viewport
export const pagesWithViewportHeight = ['chat'];
