import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  ArrowLeftIcon,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Link,
  ProgressBar,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isFunction } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { derivePrimaryVideoCta } from '../../../helpers/course';
import { getAppRoute, TRAININGS_ROUTE } from '../../../router/routes';
import NotFound from '../../atoms/NotFound';
import Video from '../../atoms/Video';
import Quiz, { type QuizAnswer, type QuizStep } from '../Quiz/Quiz';
import {
  BackButton,
  ChapterButton,
  ChapterContent,
  ChapterFooter,
  ChaptersNav,
  ChapterSub,
  ChapterTitle,
  CourseContainer,
  FooterPrimaryButton,
  Header,
  HeaderBackCell,
  HeaderContent,
  HeaderTitle,
  HeaderTitleCenter,
  HeaderTitleRow,
  HeaderTitleTrailing,
  Main,
  ProgressRow,
  VideoWrapper,
} from './Course.styles';

type CourseVideo = {
  url: string;
  title?: string;
};

export type CourseChapter = {
  id: string;
  title: string;
  video: CourseVideo;
  quizSteps: QuizStep[];
  quizCompletedTitle?: string;
  quizCompletedDescription?: string;
  quizCompletedAdditionalText?: string;
  quizCompletedIcon?: ReactNode;
  quizCompletedCtaLabel?: string;
};

export type CourseProps = {
  backLabel?: string;
  chapters: CourseChapter[];
  /** Number of chapters already completed. Defaults to 0 (fresh start). */
  completedChapterCount?: number;
  /**
   * 0-based index of the quiz step the user should resume from within the
   * current in-progress chapter. Only applied to the first unlocked chapter;
   * all other chapters start at step 0.
   */
  initialStepIndex?: number;
  courseTitle?: string;
  onBack: () => void;
  /**
   * Called each time the user correctly answers a quiz step (except the last step of a chapter,
   * which is handled by `onChapterComplete` to avoid a race between the two calls).
   * Receives the chapter's id and the 0-based index of the completed step.
   * Best-effort — errors are swallowed.
   */
  onStepComplete?: (chapterId: string, stepIndex: number) => Promise<void>;
  /**
   * Called when the user completes a chapter (quiz, or continuing from a video-only
   * chapter). Best-effort — errors are swallowed. Receives the chapter's id and its
   * 0-based index.
   */
  onChapterComplete?: (
    chapterId: string,
    chapterIndex: number,
  ) => Promise<void>;
  /** Called after the last chapter completes. May be async — awaited before any fallback navigation. */
  onCourseComplete?: () => void | Promise<void>;
};

const getQueryInt = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function computeUnlockedChapterCount(completedChapterIndexes: Set<number>) {
  let count = 0;
  while (completedChapterIndexes.has(count)) count += 1;
  return count;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function chapterHasQuiz(chapter: CourseChapter | undefined): boolean {
  return (chapter?.quizSteps.length ?? 0) > 0;
}

/** Progress units a chapter contributes: one per question, or one for a video-only chapter. */
function chapterProgressWeight(chapter: CourseChapter): number {
  return Math.max(chapter.quizSteps.length, 1);
}

export default function Course({
  chapters,
  completedChapterCount: completedChapterCountProp,
  initialStepIndex = 0,
  courseTitle,
  backLabel,
  onBack,
  onStepComplete,
  onChapterComplete,
  onCourseComplete,
}: CourseProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const completedCount = completedChapterCountProp ?? 0;

  // Keep a ref to chapters so the quiz-reset effect can read the current value
  // without needing chapters in its dependency array (chapters is often a new
  // reference on every render when the caller maps API data inline).
  const chaptersRef = useRef(chapters);
  useEffect(() => {
    chaptersRef.current = chapters;
  });

  const [completedChapterIndexes, setCompletedChapterIndexes] = useState<
    Set<number>
  >(() => new Set(Array.from({ length: completedCount }, (_, i) => i)));

  useEffect(() => {
    const currentSet = new Set(
      Array.from({ length: completedCount }, (_, i) => i),
    );
    setCompletedChapterIndexes(prev => {
      const next = new Set<number>();
      prev.forEach(value => next.add(value));
      currentSet.forEach(value => next.add(value));
      return next;
    });
  }, [completedCount]);

  const unlockedChapterCount = useMemo(
    () => computeUnlockedChapterCount(completedChapterIndexes),
    [completedChapterIndexes],
  );

  const requestedChapterIndex =
    getQueryInt(searchParams.get('chapter')) ?? null;
  const requestedMode = searchParams.get('mode');

  const unlockedNextIndex = clamp(
    unlockedChapterCount,
    0,
    Math.max(0, chapters.length - 1),
  );

  const activeChapterIndex = useMemo(() => {
    if (requestedChapterIndex === null) return unlockedNextIndex;
    const idx = clamp(
      requestedChapterIndex,
      0,
      Math.max(0, chapters.length - 1),
    );
    if (idx > unlockedChapterCount) return unlockedNextIndex;
    return idx;
  }, [
    requestedChapterIndex,
    unlockedNextIndex,
    unlockedChapterCount,
    chapters.length,
  ]);

  // Ensure we always have an explicit chapter/mode in the URL.
  // Otherwise, when backend progress changes, activeChapterIndex would be derived from unlockedNextIndex,
  // which can cause premature chapter switching while completion state is open.
  useEffect(() => {
    const chapterParam = searchParams.get('chapter');
    const modeParam = searchParams.get('mode');

    if (chapterParam === null || modeParam === null) {
      const next = new URLSearchParams(searchParams);
      if (chapterParam === null) next.set('chapter', String(unlockedNextIndex));
      if (modeParam === null) next.set('mode', 'video');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, unlockedNextIndex, setSearchParams]);

  const initialMode: 'video' | 'quiz' =
    requestedMode === 'quiz' ? 'quiz' : 'video';

  const [mode, setMode] = useState<'video' | 'quiz'>(() => initialMode);

  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Sync mode with query + completion state.
  useEffect(() => {
    const nextMode: 'video' | 'quiz' =
      requestedMode === 'quiz' ? 'quiz' : 'video';
    const chapter = chaptersRef.current[activeChapterIndex];

    // A video-only chapter has no quiz to link to, so drop mode=quiz from the URL.
    // Only once the chapter is known: chapters is not in this effect's deps, so before
    // they load every chapter looks quiz-less and the replace would strand a deep link
    // into a quiz on the video screen.
    if (nextMode === 'quiz' && chapter && !chapterHasQuiz(chapter)) {
      const next = new URLSearchParams(searchParams);
      next.set('mode', 'video');
      setSearchParams(next, { replace: true });
      setMode('video');
      return;
    }

    // Never allow quiz for already completed chapters.
    // But when the user just finished the quiz (completion screen),
    // keep them in quiz mode until they explicitly continue.
    if (
      nextMode === 'quiz' &&
      activeChapterIndex < unlockedChapterCount &&
      !isQuizCompleted
    ) {
      setMode('video');
      return;
    }

    // If chapter is locked, force video.
    if (activeChapterIndex > unlockedChapterCount) {
      setMode('video');
      return;
    }

    setMode(nextMode);
  }, [
    requestedMode,
    activeChapterIndex,
    unlockedChapterCount,
    isQuizCompleted,
    searchParams,
    setSearchParams,
  ]);

  const activeChapter = chapters[activeChapterIndex];
  const isLastChapter = activeChapterIndex >= chapters.length - 1;
  const isActiveChapterCompleted = activeChapterIndex < unlockedChapterCount;
  const hasChapterQuiz = chapterHasQuiz(activeChapter);
  // What can actually render: `mode` follows the URL, but a chapter with no questions has
  // no quiz screen, so a stale mode=quiz (e.g. arriving from a chapter that had one) would
  // leave the page blank for a frame until the sync effect above corrects it.
  const effectiveMode: 'video' | 'quiz' =
    mode === 'quiz' && hasChapterQuiz ? 'quiz' : 'video';

  const [quizCorrectStepIds, setQuizCorrectStepIds] = useState<Set<string>>(
    new Set(),
  );

  // Reset (or resume) quiz tracking whenever we enter a chapter's quiz mode.
  useEffect(() => {
    if (effectiveMode === 'quiz') {
      // When entering the current in-progress chapter, pre-populate the steps
      // the user has already answered so the progress bar and skip logic are
      // correct on resume. For all other chapters start fresh.
      const isCurrentProgressChapter = activeChapterIndex === completedCount;
      const preAnsweredCount = isCurrentProgressChapter ? initialStepIndex : 0;
      const chapter = chaptersRef.current[activeChapterIndex];
      const preAnswered =
        preAnsweredCount > 0 && chapter
          ? new Set(chapter.quizSteps.slice(0, preAnsweredCount).map(s => s.id))
          : new Set<string>();
      setQuizCorrectStepIds(preAnswered);
      setIsQuizCompleted(false);
    } else {
      setIsQuizCompleted(false);
    }
  }, [activeChapterIndex, completedCount, initialStepIndex, effectiveMode]);

  const totalProgressSteps = useMemo(
    () => chapters.reduce((acc, ch) => acc + chapterProgressWeight(ch), 0),
    [chapters],
  );

  const progressValue = useMemo(() => {
    let done = 0;

    for (let i = 0; i < chapters.length; i += 1) {
      const chapter = chapters[i];
      const isChapterCompleted = i < unlockedChapterCount;

      if (isChapterCompleted) {
        done += chapterProgressWeight(chapter);
      } else {
        if (i === activeChapterIndex) {
          // Only count question completion in quiz mode.
          if (effectiveMode === 'quiz') done += quizCorrectStepIds.size;
        }

        // Everything after current chapter is not counted yet.
        break;
      }
    }

    return clamp(done, 0, totalProgressSteps);
  }, [
    chapters,
    unlockedChapterCount,
    activeChapterIndex,
    effectiveMode,
    quizCorrectStepIds,
    totalProgressSteps,
  ]);

  const setChapterAndMode = (
    chapterIndex: number,
    nextMode: 'video' | 'quiz',
  ) => {
    const next = new URLSearchParams(searchParams);
    next.set('chapter', String(chapterIndex));
    next.set('mode', nextMode);
    setSearchParams(next);
  };

  const goToVideo = (chapterIndex: number) =>
    setChapterAndMode(chapterIndex, 'video');
  const goToQuiz = (chapterIndex: number) => {
    if (!chapterHasQuiz(chapters[chapterIndex])) return;
    setChapterAndMode(chapterIndex, 'quiz');
  };

  const handleChapterClick = (index: number) => {
    const isLocked = index > unlockedChapterCount;
    if (isLocked) return;
    goToVideo(index);
  };

  const handleQuizAnswer = (answer: QuizAnswer) => {
    if (!answer.isCorrect) return;

    const alreadyAnswered = quizCorrectStepIds.has(answer.stepId);
    setQuizCorrectStepIds(prev => {
      const next = new Set<string>(prev);
      next.add(answer.stepId);
      return next;
    });

    if (!alreadyAnswered && onStepComplete) {
      // Skip step-level persistence for the last unanswered step: onChapterComplete
      // will advance to the next chapter and would race with this call.
      const remainingUnanswered = activeChapter.quizSteps.filter(
        s => s.id !== answer.stepId && !quizCorrectStepIds.has(s.id),
      );
      if (remainingUnanswered.length > 0) {
        const stepIndex = activeChapter.quizSteps.findIndex(
          s => s.id === answer.stepId,
        );
        if (stepIndex >= 0) {
          onStepComplete(activeChapter.id, stepIndex).catch(() => {});
        }
      }
    }
  };

  const handleQuizComplete = async () => {
    setIsQuizCompleted(true);

    const alreadyRecorded = completedChapterIndexes.has(activeChapterIndex);
    // Persist as soon as chapter quiz is completed (before continue / final navigation).
    if (!alreadyRecorded && onChapterComplete) {
      await onChapterComplete(activeChapter.id, activeChapterIndex).catch(
        () => {},
      );
    }

    if (!isLastChapter) {
      goToNextChapter();
    }
  };

  const goToNextChapter = () => {
    const alreadyRecorded = completedChapterIndexes.has(activeChapterIndex);
    if (!alreadyRecorded) {
      setIsQuizCompleted(false);
      setCompletedChapterIndexes(prev => {
        if (prev.has(activeChapterIndex)) return prev;
        const next = new Set<number>();
        prev.forEach(value => next.add(value));
        next.add(activeChapterIndex);
        return next;
      });
    }

    const nextChapterIndex = activeChapterIndex + 1;
    if (nextChapterIndex < chapters.length) {
      goToVideo(nextChapterIndex);
    }
  };

  const handleOnCourseComplete = async () => {
    setIsQuizCompleted(false);

    const alreadyRecorded = completedChapterIndexes.has(activeChapterIndex);
    if (!alreadyRecorded) {
      setCompletedChapterIndexes(prev => {
        if (prev.has(activeChapterIndex)) return prev;
        const next = new Set<number>();
        prev.forEach(value => next.add(value));
        next.add(activeChapterIndex);
        return next;
      });
    }

    if (onCourseComplete) await onCourseComplete();
    else onBack();
  };

  const completeVideoOnlyChapter = async () => {
    const alreadyRecorded = completedChapterIndexes.has(activeChapterIndex);
    if (!alreadyRecorded && onChapterComplete) {
      await onChapterComplete(activeChapter.id, activeChapterIndex).catch(
        () => {},
      );
    }

    if (isLastChapter) {
      await handleOnCourseComplete();
      return;
    }

    goToNextChapter();
  };

  const primaryVideoCta = derivePrimaryVideoCta({
    isChapterCompleted: isActiveChapterCompleted,
    hasChapterQuiz,
    isLastChapter,
  });

  const handlePrimaryVideoCta = () => {
    if (isAdvancing) return;

    if (primaryVideoCta.action === 'start_quiz') {
      goToQuiz(activeChapterIndex);
      return;
    }
    if (primaryVideoCta.action === 'next_chapter') {
      goToNextChapter();
      return;
    }

    // The remaining actions persist progress, so hold the button until they settle —
    // a second click would fire onChapterComplete again before the first one lands.
    setIsAdvancing(true);
    const advancing =
      primaryVideoCta.action === 'finish_course'
        ? handleOnCourseComplete()
        : completeVideoOnlyChapter();
    advancing.catch(() => {}).finally(() => setIsAdvancing(false));
  };

  if (!activeChapter || chapters.length === 0)
    return (
      <NotFound title={t('resources.trainings.not_found')}>
        <Link
          to={getAppRoute(TRAININGS_ROUTE)}
          buttonAppearance={ButtonAppearance.Primary}
        >
          {t('resources.trainings.return')}
        </Link>
      </NotFound>
    );
  return (
    <CourseContainer>
      <Header>
        <HeaderContent>
          <HeaderTitleRow>
            <HeaderBackCell>
              {isFunction(onBack) && (
                <BackButton
                  variation={ButtonVariations.Icon}
                  appearance={ButtonAppearance.Secondary}
                  onClick={
                    effectiveMode === 'video'
                      ? onBack
                      : () => goToVideo(activeChapterIndex)
                  }
                >
                  <ArrowLeftIcon label="back" width={12} height={12} />
                  {effectiveMode === 'video'
                    ? (backLabel ?? t('course.nav_back'))
                    : t('course.nav_back_to_video')}
                </BackButton>
              )}
            </HeaderBackCell>
            <HeaderTitleCenter>
              <HeaderTitle type={TextTypes.Heading3} center>
                {courseTitle ?? t('course.title')}
              </HeaderTitle>
            </HeaderTitleCenter>
            <HeaderTitleTrailing aria-hidden />
          </HeaderTitleRow>
          <ProgressRow>
            <ProgressBar
              fullWidth
              max={totalProgressSteps}
              value={progressValue}
              hideLabel
            />
          </ProgressRow>
          <ChaptersNav>
            {chapters.map((chapter, index) => {
              const isActive = index === activeChapterIndex;
              const isCompleted = index < unlockedChapterCount;
              const isLocked = index > unlockedChapterCount;
              let chapterStatus = t('course.chapter_status_in_progress');
              if (isCompleted) {
                chapterStatus = t('course.chapter_status_completed');
              } else if (isLocked) {
                chapterStatus = t('course.chapter_status_locked');
              }
              return (
                <ChapterButton
                  key={`nav-${chapter.id}`}
                  type="button"
                  onClick={() => handleChapterClick(index)}
                  disabled={isLocked}
                  $isActive={isActive}
                  $isCompleted={isCompleted}
                  $isLocked={isLocked}
                >
                  <ChapterTitle type={TextTypes.Body4} bold>
                    {chapter.title}
                  </ChapterTitle>
                  <ChapterSub type={TextTypes.Body4}>
                    {chapterStatus}
                  </ChapterSub>
                </ChapterButton>
              );
            })}
          </ChaptersNav>
        </HeaderContent>
      </Header>

      <Main>
        {effectiveMode === 'video' && (
          <>
            <ChapterContent key={`${activeChapterIndex}-video`}>
              <VideoWrapper>
                <Video
                  src={activeChapter.video.url}
                  title={activeChapter.video.title ?? activeChapter.title}
                  maxWidth="960px"
                />
              </VideoWrapper>
            </ChapterContent>

            <ChapterFooter>
              {activeChapterIndex > 0 && (
                <Button
                  appearance={ButtonAppearance.Secondary}
                  size={ButtonSizes.Medium}
                  onClick={() => {
                    if (activeChapterIndex <= unlockedChapterCount) {
                      goToVideo(activeChapterIndex - 1);
                    }
                  }}
                  disabled={activeChapterIndex === 0}
                >
                  {t('course.nav_previous_chapter')}
                </Button>
              )}

              <FooterPrimaryButton
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Medium}
                onClick={handlePrimaryVideoCta}
                disabled={isAdvancing}
              >
                {t(primaryVideoCta.labelKey)}
              </FooterPrimaryButton>
            </ChapterFooter>
          </>
        )}

        {effectiveMode === 'quiz' && (
          <ChapterContent>
            <Quiz
              key={`quiz-${activeChapterIndex}`}
              steps={activeChapter.quizSteps}
              currentStep={
                activeChapterIndex === completedCount ? initialStepIndex + 1 : 1
              }
              exitRoute={undefined}
              hideProgress
              completedIcon={activeChapter.quizCompletedIcon}
              completedTitle={activeChapter.quizCompletedTitle}
              completedDescription={activeChapter.quizCompletedDescription}
              completedAdditionalText={
                activeChapter.quizCompletedAdditionalText
              }
              completedCtaLabel={activeChapter.quizCompletedCtaLabel}
              showCompletionCard={isLastChapter}
              onExitLabel={
                activeChapterIndex + 1 < chapters.length
                  ? t('course.chapter_complete_button_continue')
                  : t('course.chapter_complete_button_finish')
              }
              onAnswer={handleQuizAnswer}
              onComplete={handleQuizComplete}
              onExit={isLastChapter ? handleOnCourseComplete : undefined}
            />
          </ChapterContent>
        )}
      </Main>
    </CourseContainer>
  );
}
