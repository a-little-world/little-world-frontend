import type { ApiCourseChapter, ApiQuizStep } from '../api/courses';
import type { CourseChapter } from '../components/blocks/Course/Course';
import type { QuizStep } from '../components/blocks/Quiz/Quiz';

function mapQuizStep(step: ApiQuizStep, chapterId: string): QuizStep {
  const options = step.answers.map((answer, idx) => ({
    id: String(idx),
    label: answer,
  }));
  const correctIndex = step.answers.indexOf(step.correct_answer);
  return {
    id: `${chapterId}_q_${step.order}`,
    question: step.question,
    required: true,
    options,
    correctOptionId: String(correctIndex >= 0 ? correctIndex : 0),
  };
}

export function mapChapter(ch: ApiCourseChapter): CourseChapter {
  return {
    id: ch.chapter_id,
    title: ch.title,
    video: {
      url: ch.video_url,
      title: ch.video_title || undefined,
    },
    quizSteps: ch.quiz_steps.map(step => mapQuizStep(step, ch.chapter_id)),
    quizCompletedTitle: ch.completed_title || undefined,
    quizCompletedDescription: ch.completed_description || undefined,
    quizCompletedAdditionalText: ch.completed_additional_text || undefined,
    quizCompletedCtaLabel: ch.completed_cta_label || undefined,
  };
}

/** Step id persisted by `/api/user/self_onboarding/update/` (last quiz step per chapter). */
export function getSelfOnboardingStepIdForChapter(
  chapter: CourseChapter,
): string {
  return chapter.quizSteps.at(-1)?.id ?? chapter.id;
}

export function getCompletedChapterCountForStoredStep(
  chapters: CourseChapter[],
  storedStepId: string,
): number {
  if (!storedStepId) return 0;
  const idx = chapters.findIndex(
    ch =>
      ch.id === storedStepId ||
      ch.quizSteps.some(step => step.id === storedStepId),
  );
  return idx >= 0 ? idx + 1 : 0;
}

export function getCompletedChapterCountForCourseProgress(
  chapters: CourseChapter[],
  currentChapterId: string,
): number {
  if (!currentChapterId) return 0;
  const idx = chapters.findIndex(ch => ch.id === currentChapterId);
  return idx > 0 ? idx : 0;
}
