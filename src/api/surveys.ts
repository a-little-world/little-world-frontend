import { apiFetch } from './helpers';

export type SurveyQuestionType = 'rating' | 'text' | 'choice';

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
}

/**
 * Copy arrives as finished text in the user's language rather than as i18n keys: campaigns are
 * written in the admin panel, so their wording cannot be in the locale files that ship with
 * this bundle.
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

export type SurveyAnswers = Record<string, number | string>;

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
