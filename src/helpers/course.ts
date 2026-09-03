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

/**
 * Marker persisted by `/api/user/self_onboarding/update/` for a finished chapter: its last
 * quiz step id, or the chapter id itself when the chapter is video-only and has no quiz step
 * to report. The endpoint accepts both forms.
 */
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

/**
 * How many chapters the learner has finished, from persisted course progress.
 *
 * `current_chapter_id` names the chapter they are *on*, so the count is its index — which
 * caps at `chapters.length - 1` and can never say "all done". Only the `completed` flag
 * can express that, so a finished course short-circuits to every chapter, exactly as the
 * backend's `UserCourseProgress.progress_fraction()` does. Without it the final chapter
 * still renders as in progress after the course has been completed.
 */
export function getCompletedChapterCountForCourseProgress(
  chapters: CourseChapter[],
  currentChapterId: string,
  isCourseCompleted = false,
): number {
  if (isCourseCompleted) return chapters.length;
  if (!currentChapterId) return 0;
  const idx = chapters.findIndex(ch => ch.id === currentChapterId);
  return idx > 0 ? idx : 0;
}

export type PrimaryVideoAction =
  | 'start_quiz'
  | 'complete_chapter'
  | 'next_chapter'
  | 'finish_course';

export type PrimaryVideoCta = {
  action: PrimaryVideoAction;
  labelKey: string;
};

/**
 * The primary button below a chapter's video.
 *
 * A chapter with no quiz steps is video-only: there is no quiz to send the learner to, so
 * the button completes the chapter itself and moves on (or finishes the course).
 */
export function derivePrimaryVideoCta({
  isChapterCompleted,
  hasChapterQuiz,
  isLastChapter,
}: {
  isChapterCompleted: boolean;
  hasChapterQuiz: boolean;
  isLastChapter: boolean;
}): PrimaryVideoCta {
  if (isChapterCompleted) {
    return isLastChapter
      ? {
          action: 'finish_course',
          labelKey: 'course.chapter_complete_button_finish',
        }
      : {
          action: 'next_chapter',
          labelKey: 'course.chapter_complete_button_continue',
        };
  }

  if (hasChapterQuiz) {
    return { action: 'start_quiz', labelKey: 'course.nav_continue_to_quiz' };
  }

  return {
    action: 'complete_chapter',
    labelKey: isLastChapter
      ? 'course.chapter_complete_button_finish'
      : 'course.nav_continue_to_next_chapter',
  };
}
