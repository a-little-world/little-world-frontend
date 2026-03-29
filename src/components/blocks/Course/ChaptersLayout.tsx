import {
  ArrowLeftIcon,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CardContent,
  ProgressBar,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

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
};

export type ChaptersLayoutProps = {
  chapters: CourseChapter[];
  currentStep?: number;
  courseTitle?: string;
  onBack: () => void;
  /**
   * Persist progress in backend (best-effort). If not provided, we still update local UI + URL params.
   * The expected backend behavior is to update `user.walkthrough_step` so that it points to the next unlocked
   * chapter video index.
   */
  onPersistCourseStep?: (nextCourseStep: number) => Promise<void>;
  onCourseComplete?: () => void;
};

const CourseContainer = styled.div`
  min-height: 100vh;
  width: 100%;

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
`;

const HeaderInner = styled.div`
  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const HeaderLeft = styled.div`
  width: 40px;
  display: flex;
  justify-content: flex-start;
`;

const HeaderTitle = styled(Text)`
  text-align: center;
`;

const HeaderRight = styled.div`
  width: 40px;
`;

const ProgressRow = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.small};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

const PillsRow = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.xsmall}
    ${({ theme }) => theme.spacing.medium};
`;

const PillButton = styled.button<{
  $isActive?: boolean;
  $isCompleted?: boolean;
  $isLocked?: boolean;
}>`
  min-height: 44px;
  min-width: 130px;
  padding: ${({ theme }) => theme.spacing.xsmall}
    ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.radius.large};
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
`;

const PillTitle = styled(Text)`
  font-size: 14px;
  font-weight: 600;
`;

const PillSub = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.medium};
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const ChapterContent = styled(CardContent)`
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
`;

const VideoWrapper = styled.div`
  overflow: hidden;
  flex: 1;
  width: 100%;
`;

const NavButton = styled(Button)``;

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

export default function ChaptersLayout({
  chapters,
  currentStep = 0,
  courseTitle,
  onBack,
  onPersistCourseStep,
  onCourseComplete,
}: ChaptersLayoutProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const completedCount = clamp(
    Math.floor(currentStep),
    0,
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

  const progressPercent = totalProgressSteps
    ? Math.round((progressValue / totalProgressSteps) * 100)
    : 0;

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

  const handleChapterPillClick = (index: number) => {
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

  const persistOnboardingStepBestEffort = async (next: number) => {
    if (!onPersistCourseStep) return;
    try {
      await onPersistCourseStep(next);
    } catch {
      // Best-effort only; URL + local state still drive the UX.
    }
  };

  const handleQuizComplete = async () => {
    setIsQuizCompleted(true);

    // Mark the chapter completed so progress/pills reflect it immediately,
    // but keep the user in quiz mode until they click continue.
    setCompletedChapterIndexes(prev => {
      if (prev.has(activeChapterIndex)) return prev;
      const next = new Set<number>();
      prev.forEach(value => next.add(value));
      next.add(activeChapterIndex);
      return next;
    });

    // Best-effort persistence; progress UI continues regardless.
    await persistOnboardingStepBestEffort(activeChapterIndex + 1);
  };

  const handleContinueAfterChapterComplete = () => {
    const nextChapterIndex = activeChapterIndex + 1;

    setIsQuizCompleted(false);
    if (nextChapterIndex < chapters.length) {
      goToVideo(nextChapterIndex);
      return;
    }

    if (onCourseComplete) onCourseComplete();
    else onBack();
  };

  if (!activeChapter || chapters.length === 0) return null;
  return (
    <CourseContainer>
      <StickyHeader>
        <HeaderInner>
          <HeaderLeft>
            <Button variation={ButtonVariations.Icon} onClick={onBack}>
              <ArrowLeftIcon label="back" width={16} height={16} />
            </Button>
          </HeaderLeft>
          <HeaderTitle type={TextTypes.Body1} bold>
            {courseTitle ?? t('onboarding_walkthrough.title')}
          </HeaderTitle>
          <HeaderRight />
        </HeaderInner>

        <ProgressRow>
          <ProgressMeta>
            <Text type={TextTypes.Body4}>{progressPercent}% complete</Text>
            <Text type={TextTypes.Body4}>
              {Math.min(unlockedChapterCount, chapters.length)}/
              {chapters.length} chapters
            </Text>
          </ProgressMeta>
          <ProgressBar
            fullWidth
            max={totalProgressSteps}
            value={progressValue}
          />
        </ProgressRow>

        <PillsRow>
          {chapters.map((chapter, index) => {
            const isActive = index === activeChapterIndex;
            const isCompleted = index < unlockedChapterCount;
            const isLocked = index > unlockedChapterCount;
            let pillStatus = t(
              'onboarding_walkthrough.pill_status_in_progress',
            );
            if (isCompleted) {
              pillStatus = t('onboarding_walkthrough.pill_status_completed');
            } else if (isLocked) {
              pillStatus = t('onboarding_walkthrough.pill_status_locked');
            }
            return (
              <PillButton
                key={chapter.id}
                type="button"
                onClick={() => handleChapterPillClick(index)}
                disabled={isLocked}
                $isActive={isActive}
                $isCompleted={isCompleted}
                $isLocked={isLocked}
              >
                <PillTitle type={TextTypes.Body3} bold>
                  {chapter.title}
                </PillTitle>
                <PillSub type={TextTypes.Body4}>{pillStatus}</PillSub>
              </PillButton>
            );
          })}
        </PillsRow>
      </StickyHeader>

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

              {activeChapterIndex < unlockedChapterCount && (
                <Text center type={TextTypes.Body4}>
                  {t('onboarding_walkthrough.chapter_completed_hint')}
                </Text>
              )}
            </ChapterContent>

            <ChapterFooter>
              <NavButton
                appearance={ButtonAppearance.Secondary}
                size={ButtonSizes.Medium}
                onClick={() => {
                  if (
                    activeChapterIndex > 0 &&
                    activeChapterIndex <= unlockedChapterCount
                  ) {
                    goToVideo(activeChapterIndex - 1);
                  }
                }}
                disabled={activeChapterIndex === 0}
              >
                {t('onboarding_walkthrough.nav_back')}
              </NavButton>

              <NavButton
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Medium}
                onClick={() => goToQuiz(activeChapterIndex)}
                disabled={activeChapterIndex < unlockedChapterCount}
              >
                {t('onboarding_walkthrough.nav_continue_to_quiz')}
              </NavButton>
            </ChapterFooter>
          </>
        )}

        {mode === 'quiz' && (
          <>
            <ChapterContent>
              <Quiz
                steps={activeChapter.quizSteps}
                currentStep={1}
                exitRoute={undefined}
                hideProgress
                onAnswer={handleQuizAnswer}
                onComplete={handleQuizComplete}
              />
            </ChapterContent>
            <ChapterFooter>
              <NavButton
                appearance={ButtonAppearance.Secondary}
                size={ButtonSizes.Medium}
                onClick={() => goToVideo(activeChapterIndex)}
              >
                {t('onboarding_walkthrough.nav_back_to_video')}
              </NavButton>
              {isQuizCompleted && (
                <NavButton
                  appearance={ButtonAppearance.Primary}
                  size={ButtonSizes.Medium}
                  onClick={handleContinueAfterChapterComplete}
                >
                  {activeChapterIndex + 1 < chapters.length
                    ? t(
                        'onboarding_walkthrough.chapter_complete_button_continue',
                      )
                    : t(
                        'onboarding_walkthrough.chapter_complete_button_finish',
                      )}
                </NavButton>
              )}
            </ChapterFooter>
          </>
        )}
      </Main>
    </CourseContainer>
  );
}
