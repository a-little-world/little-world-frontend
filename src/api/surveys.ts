import { apiFetch } from './helpers';

export type SurveyQuestionType = 'rating' | 'text' | 'choice' | 'multiselect';

export interface SurveyChoiceOption {
  value: string;
  label: string;
}

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  required?: boolean;
  label: string;
  placeholder?: string;
  options?: SurveyChoiceOption[];
  scale?: number;
}

/**
 * Copy arrives as finished text in the user's language rather than as i18n keys: campaigns and
 * their associated copy are written in the management panel
 */
export interface PendingSurvey {
  id: number;
  campaign: string;
  scale: number;
  context_key: string;
  title: string;
  description: string;
  submit_button: string;
  questions: SurveyQuestion[];
}

export type SurveyAnswerValue = number | string | string[];
export type SurveyAnswers = Record<string, SurveyAnswerValue>;

/**
 * Tells the backend the card was actually rendered.
 *
 * Separate from fetching the survey on purpose: the pending request only proves the backend
 * offered it, so offers accumulating while this never fires is how a broken modal becomes
 * visible instead of silent.
 */
export const markSurveyShown = async (surveyId: number): Promise<void> => {
  await apiFetch(`/api/surveys/${surveyId}/shown`, { method: 'POST' });
};

export const submitSurvey = async ({
  surveyId,
  answers,
}: {
  surveyId: number;
  answers: SurveyAnswers;
}): Promise<void> => {
  await apiFetch(`/api/surveys/${surveyId}/submit`, {
    method: 'POST',
    body: { answers },
  });
};

export const dismissSurvey = async (surveyId: number): Promise<void> => {
  await apiFetch(`/api/surveys/${surveyId}/dismiss`, { method: 'POST' });
};

export type SurveyLinkState =
  | 'available'
  | 'already_submitted'
  | 'ineligible'
  | 'inactive'
  | 'missing_context'
  | 'not_found';

export interface SurveyLinkResponse {
  state: SurveyLinkState;
  survey: PendingSurvey | null;
}

export const getSurveyBySlugEndpoint = (
  slug: string,
  liveSession?: string | null,
) => {
  const query = liveSession
    ? `?live_session=${encodeURIComponent(liveSession)}`
    : '';
  return `/api/surveys/${encodeURIComponent(slug)}${query}`;
};

export const fetchSurveyBySlug = async (
  slug: string,
  liveSession?: string | null,
): Promise<SurveyLinkResponse> => {
  try {
    return await apiFetch<SurveyLinkResponse>(
      getSurveyBySlugEndpoint(slug, liveSession),
    );
  } catch (error: any) {
    if (error?.status === 404) {
      return { state: 'not_found', survey: null };
    }
    throw error;
  }
};

/** Read-only: does not create or open a survey offer the way GET-by-slug does. */
export const getSurveyStatusEndpoint = (slug: string) =>
  `/api/surveys/${encodeURIComponent(slug)}/status`;

/** Resolves to `null` when no campaign exists at the slug. */
export const fetchSurveyStatus = async (
  slug: string,
): Promise<{ submitted: boolean } | null> => {
  try {
    return await apiFetch<{ submitted: boolean }>(
      getSurveyStatusEndpoint(slug),
    );
  } catch (error: any) {
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
};
