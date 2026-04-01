import {
  ArrowLeftIcon,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  ProgressBar,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { mutate } from 'swr';

import { SELF_ONBOARDING_WALKTHROUGH_STEP_IDS } from '../../../constants';
import { USER_ENDPOINT } from '../../../features/swr';
import Video from '../../atoms/Video';
import Quiz, { type QuizAnswer, type QuizStep } from '../Quiz/Quiz';

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

export type ChaptersLayoutProps = {
  chapters: CourseChapter[];
  /** Latest completed self-onboarding step id from the backend (drives unlocked chapters). */
  currentStepId?: string;
  courseTitle?: string;
  onBack: () => void;
  /**
   * Persist progress in backend (best-effort). If not provided, we still update local UI + URL params.
   * The expected backend behavior is to update `user.walkthrough_step` so that it points to the next unlocked
   * chapter video index.
   */
  onUpdateCourseStep?: (nextStepId: string) => Promise<void>;
  onCourseComplete?: () => void;
};

const CourseContainer = styled.div`
  width: 100%;

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const Header = styled.header`
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 1240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const HeaderTitle = styled(Text)`
  display: none;
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  `}
`;

const ProgressRow = styled.div`
  padding: ${({ theme }) => theme.spacing.xxsmall};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small} ${theme.spacing.small}
        ${theme.spacing.xxsmall};
    }
  `}
`;

const Navigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  width: 100%;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

const NavButton = styled(Button)`
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing.xxsmall} !important;
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      margin-bottom: ${theme.spacing.xsmall};
    }
  `}
`;

const ChaptersNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.xsmall}
    ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small} ${theme.spacing.medium};
    }
  `}
`;

const ChapterButton = styled.button<{
  $isActive?: boolean;
  $isCompleted?: boolean;
  $isLocked?: boolean;
}>`
  min-height: 44px;
  min-width: 130px;
  border-radius: ${({ theme }) => theme.radius.large};
  padding: ${({ theme }) => theme.spacing.xsmall};
  border: 2px solid
    ${({ theme, $isActive, $isCompleted }) => {
      if ($isActive) return theme.color.border.selected;
      if ($isCompleted) return theme.color.border.success;
      return theme.color.border.subtle;
    }};
  background: ${({ theme, $isActive, $isCompleted }) => {
    if ($isActive) return theme.color.surface.primary;
    if ($isCompleted) return theme.color.surface.success;
    return theme.color.surface.secondary;
  }};
  color: ${({ theme, $isLocked }) =>
    $isLocked ? theme.color.text.secondary : theme.color.text.heading};
  cursor: ${({ $isLocked }) => ($isLocked ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isLocked }) => ($isLocked ? 0.6 : 1)};
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xsmall} ${theme.spacing.medium};
    }
  `}
`;

const ChapterTitle = styled(Text)`
  font-size: 14px;
  font-weight: 600;
`;

const ChapterSub = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const Main = styled.main`
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
    }
  `}
`;

const ChapterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const ChapterFooter = styled.div`
  display: flex;
  order: 1;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 960px; // video max width
  margin: 0 auto;
`;

const VideoWrapper = styled.div`
  overflow: hidden;
  flex: 1;
  width: 100%;
`;

const FooterPrimaryButton = styled(Button)`
  margin-left: auto;
`;

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

function completedChaptersFromStepId(
  stepId: string | undefined,
  maxChapters: number,
): number {
  if (!stepId) return 0;
  const ids = SELF_ONBOARDING_WALKTHROUGH_STEP_IDS as readonly string[];
  const idx = ids.indexOf(stepId);
  if (idx < 0) return 0;
  return clamp(idx + 1, 0, maxChapters);
}

export default function ChaptersLayout({
  chapters,
  currentStepId,
  courseTitle,
  onBack,
  onUpdateCourseStep,
  onCourseComplete,
}: ChaptersLayoutProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const completedCount = completedChaptersFromStepId(
    currentStepId,
    Math.max(0, chapters.length),
  );

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

  // Sync mode with query + completion state.
  useEffect(() => {
    const nextMode: 'video' | 'quiz' =
      requestedMode === 'quiz' ? 'quiz' : 'video';

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
  ]);

  const activeChapter = chapters[activeChapterIndex];
  const isLastChapter = activeChapterIndex >= chapters.length - 1;

  const [quizCorrectStepIds, setQuizCorrectStepIds] = useState<Set<string>>(
    new Set(),
  );

  // Reset quiz tracking whenever we enter a new chapter's quiz mode.
  useEffect(() => {
    if (mode === 'quiz') {
      setQuizCorrectStepIds(new Set());
      setIsQuizCompleted(false);
    } else {
      setIsQuizCompleted(false);
    }
  }, [activeChapterIndex, mode]);

  const totalProgressSteps = useMemo(
    () => chapters.reduce((acc, ch) => acc + ch.quizSteps.length, 0),
    [chapters],
  );

  const progressValue = useMemo(() => {
    let done = 0;

    for (let i = 0; i < chapters.length; i += 1) {
      const chapter = chapters[i];
      const isChapterCompleted = i < unlockedChapterCount;

      if (isChapterCompleted) {
        done += chapter.quizSteps.length;
      } else {
        if (i === activeChapterIndex) {
          // Only count question completion in quiz mode.
          if (mode === 'quiz') done += quizCorrectStepIds.size;
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
    mode,
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
  const goToQuiz = (chapterIndex: number) =>
    setChapterAndMode(chapterIndex, 'quiz');

  const handleChapterClick = (index: number) => {
    const isLocked = index > unlockedChapterCount;
    if (isLocked) return;
    goToVideo(index);
  };

  const handleQuizAnswer = (answer: QuizAnswer) => {
    if (!answer.isCorrect) return;
    setQuizCorrectStepIds(prev => {
      const next = new Set<string>();
      prev.forEach(value => next.add(value));
      next.add(answer.stepId);
      return next;
    });
  };

  const persistOnboardingStepBestEffort = async (stepId: string) => {
    if (!onUpdateCourseStep) return;
    await onUpdateCourseStep(stepId);
  };

  const handleQuizComplete = async () => {
    setIsQuizCompleted(true);

    const alreadyRecorded = completedChapterIndexes.has(activeChapterIndex);
    // Persist as soon as chapter quiz is completed (before continue / final navigation).
    if (!alreadyRecorded) {
      const stepId = SELF_ONBOARDING_WALKTHROUGH_STEP_IDS[activeChapterIndex];
      if (stepId) await persistOnboardingStepBestEffort(stepId);
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

    // Ensure onboarding redirect logic reads fresh user state before navigating.
    await mutate(USER_ENDPOINT);

    if (onCourseComplete) onCourseComplete();
    else onBack();
  };

  if (!activeChapter || chapters.length === 0) return null;
  return (
    <CourseContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle type={TextTypes.Body1} bold center>
            {courseTitle ?? t('onboarding_walkthrough.title')}
          </HeaderTitle>
          <ProgressRow>
            <ProgressBar
              fullWidth
              max={totalProgressSteps}
              value={progressValue}
            />
          </ProgressRow>
          <Navigation>
            <ChaptersNav>
              {chapters.map((chapter, index) => {
                const isActive = index === activeChapterIndex;
                const isCompleted = index < unlockedChapterCount;
                const isLocked = index > unlockedChapterCount;
                let chapterStatus = t(
                  'onboarding_walkthrough.chapter_status_in_progress',
                );
                if (isCompleted) {
                  chapterStatus = t(
                    'onboarding_walkthrough.chapter_status_completed',
                  );
                } else if (isLocked) {
                  chapterStatus = t(
                    'onboarding_walkthrough.chapter_status_locked',
                  );
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
                    <ChapterTitle type={TextTypes.Body3} bold>
                      {chapter.title}
                    </ChapterTitle>
                    <ChapterSub type={TextTypes.Body4}>
                      {chapterStatus}
                    </ChapterSub>
                  </ChapterButton>
                );
              })}
            </ChaptersNav>
            {mode === 'quiz' && (
              <NavButton
                variation={ButtonVariations.Icon}
                appearance={ButtonAppearance.Secondary}
                onClick={() => goToVideo(activeChapterIndex)}
              >
                <ArrowLeftIcon label="back" width={16} height={16} />
                {t('onboarding_walkthrough.nav_back_to_video')}
              </NavButton>
            )}
          </Navigation>
        </HeaderContent>
      </Header>

      <Main>
        {mode === 'video' && (
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
                  {t('onboarding_walkthrough.nav_back')}
                </Button>
              )}

              {isLastChapter && completedCount === chapters.length ? (
                <FooterPrimaryButton
                  appearance={ButtonAppearance.Primary}
                  size={ButtonSizes.Medium}
                  onClick={handleOnCourseComplete}
                >
                  {t('onboarding_walkthrough.chapter_complete_button_finish')}
                </FooterPrimaryButton>
              ) : (
                <FooterPrimaryButton
                  appearance={ButtonAppearance.Primary}
                  size={ButtonSizes.Medium}
                  onClick={
                    activeChapterIndex < unlockedChapterCount
                      ? goToNextChapter
                      : () => goToQuiz(activeChapterIndex)
                  }
                >
                  {activeChapterIndex < unlockedChapterCount
                    ? t(
                        'onboarding_walkthrough.chapter_complete_button_continue',
                      )
                    : t('onboarding_walkthrough.nav_continue_to_quiz')}
                </FooterPrimaryButton>
              )}
            </ChapterFooter>
          </>
        )}

        {mode === 'quiz' && (
          <ChapterContent>
            <Quiz
              steps={activeChapter.quizSteps}
              currentStep={1}
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
                  ? t('onboarding_walkthrough.chapter_complete_button_continue')
                  : t('onboarding_walkthrough.chapter_complete_button_finish')
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
