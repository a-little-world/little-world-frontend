import {
  ArrowLeftIcon,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  ConfettiImage,
  Modal,
  ProgressBar,
  Tag,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled, { keyframes, useTheme } from 'styled-components';

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

export type CourseChaptersLayoutOptionAProps = {
  chapters: CourseChapter[];
  backendOnboardingStep?: number;
  courseTitle?: string;
  onBack: () => void;
  /**
   * Persist progress in backend (best-effort). If not provided, we still update local UI + URL params.
   * The expected backend behavior is to update `user.onboarding_step` so that it points to the next unlocked
   * chapter video index.
   */
  onPersistOnboardingStep?: (nextOnboardingStep: number) => Promise<void>;
  onCourseComplete?: () => void;
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

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

const ContentHeader = styled.div<{ $variant: 'video' | 'quiz' }>`
  padding: ${({ theme }) => theme.spacing.medium};
  background: ${({ theme, $variant }) =>
    $variant === 'video'
      ? theme.color.gradient.blue10
      : theme.color.gradient.orange10};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
`;

const ContentTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.reversed};
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

const CompletionCard = styled(Card)`
  border: 2px solid ${({ theme }) => theme.color.border.selected};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 260ms ease-out both;
`;

const FloatingCelebration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 120px;
  width: 100%;

  & > * {
    animation: ${float} 2.8s ease-in-out infinite;
  }
`;

const CompletionTitle = styled(Text)``;

const CompletionBody = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

const getQueryInt = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function computeCompletedContiguousCount(completedIndices: Set<number>) {
  let count = 0;
  while (completedIndices.has(count)) count += 1;
  return count;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function CourseChaptersLayoutOptionA({
  chapters,
  backendOnboardingStep,
  courseTitle,
  onBack,
  onPersistOnboardingStep,
  onCourseComplete,
}: CourseChaptersLayoutOptionAProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();

  const backendStep = backendOnboardingStep ?? 0;
  const backendCompletedCount = clamp(
    Math.floor(backendStep),
    0,
    Math.max(0, chapters.length),
  );

  const [completedIndices, setCompletedIndices] = useState<Set<number>>(
    () => new Set(Array.from({ length: backendCompletedCount }, (_, i) => i)),
  );

  useEffect(() => {
    const backendSet = new Set(
      Array.from({ length: backendCompletedCount }, (_, i) => i),
    );
    setCompletedIndices(prev => {
      const next = new Set<number>();
      prev.forEach(value => next.add(value));
      backendSet.forEach(value => next.add(value));
      return next;
    });
  }, [backendCompletedCount]);

  const completedContiguousCount = useMemo(
    () => computeCompletedContiguousCount(completedIndices),
    [completedIndices],
  );

  const requestedChapterIndex =
    getQueryInt(searchParams.get('chapter')) ?? null;
  const requestedMode = searchParams.get('mode');

  const unlockedNextIndex = clamp(
    completedContiguousCount,
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
    if (idx > completedContiguousCount) return unlockedNextIndex;
    return idx;
  }, [
    requestedChapterIndex,
    unlockedNextIndex,
    completedContiguousCount,
    chapters.length,
  ]);

  // Ensure we always have an explicit chapter/mode in the URL.
  // Otherwise, when backend progress changes, activeChapterIndex would be derived from unlockedNextIndex,
  // which can cause premature chapter switching while the completion modal is open.
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

  const [showChapterCompleteModal, setShowChapterCompleteModal] =
    useState(false);

  // Sync mode with query + completion state.
  useEffect(() => {
    // Prevent quiz -> video switching while the completion modal is open.
    if (showChapterCompleteModal) return;
    const nextMode: 'video' | 'quiz' =
      requestedMode === 'quiz' ? 'quiz' : 'video';

    // Never allow quiz for already completed chapters.
    if (nextMode === 'quiz' && activeChapterIndex < completedContiguousCount) {
      setMode('video');
      return;
    }

    // If chapter is locked, force video.
    if (activeChapterIndex > completedContiguousCount) {
      setMode('video');
      return;
    }

    setMode(nextMode);
  }, [
    requestedMode,
    activeChapterIndex,
    completedContiguousCount,
    showChapterCompleteModal,
  ]);

  const isCourseComplete = completedContiguousCount >= chapters.length;
  const activeChapter = chapters[activeChapterIndex];

  const [quizCorrectStepIds, setQuizCorrectStepIds] = useState<Set<string>>(
    new Set(),
  );

  // Reset quiz tracking whenever we enter a new chapter's quiz mode.
  useEffect(() => {
    if (mode === 'quiz') setQuizCorrectStepIds(new Set());
  }, [activeChapterIndex, mode]);

  const totalProgressSteps = useMemo(
    () => chapters.reduce((acc, ch) => acc + ch.quizSteps.length, 0),
    [chapters],
  );

  const progressValue = useMemo(() => {
    let done = 0;

    for (let i = 0; i < chapters.length; i += 1) {
      const chapter = chapters[i];
      const isChapterCompleted = i < completedContiguousCount;

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
    completedContiguousCount,
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
    const isLocked = index > completedContiguousCount;
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
    if (!onPersistOnboardingStep) return;
    try {
      await onPersistOnboardingStep(next);
    } catch {
      // Best-effort only; URL + local state still drive the UX.
    }
  };

  const handleQuizComplete = () => {
    // Mark the chapter as completed immediately so:
    // - locking and progress UI update right away
    // - dismissing the completion modal still keeps the chapter completed
    setCompletedIndices(prev => {
      const next = new Set<number>();
      prev.forEach(value => next.add(value));
      next.add(activeChapterIndex);
      return next;
    });

    // Persist by moving the onboarding step forward so the next chapter becomes unlocked.
    // If your backend expects a different mapping, adjust this in OnboardingModule.
    persistOnboardingStepBestEffort(activeChapterIndex + 1).catch(() => {});
    setShowChapterCompleteModal(true);
  };

  const handleContinueAfterChapterComplete = async () => {
    const chapterCompletedIndex = activeChapterIndex;
    const nextChapterIndex = chapterCompletedIndex + 1;

    setShowChapterCompleteModal(false);

    if (nextChapterIndex < chapters.length) {
      goToVideo(nextChapterIndex);
    } else {
      // Course finished.
      if (onCourseComplete) onCourseComplete();
      // Keep user on the last chapter video in case they refresh.
      goToVideo(chapters.length - 1);
    }
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
              {Math.min(completedContiguousCount, chapters.length)}/
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
            const isCompleted = index < completedContiguousCount;
            const isLocked = index > completedContiguousCount;
            let pillStatus = t('onboarding_walkthrough.pill_status_in_progress');
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
        <ContentHeader $variant={mode === 'quiz' ? 'quiz' : 'video'}>
          <Tag>
            {mode === 'quiz'
              ? t('onboarding_walkthrough.mode_quiz')
              : t('onboarding_walkthrough.mode_video')}
          </Tag>
          <ContentTitle type={TextTypes.Heading4} bold>
            {activeChapter.title}
          </ContentTitle>
        </ContentHeader>

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

              {activeChapterIndex < completedContiguousCount && (
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
                    activeChapterIndex <= completedContiguousCount
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
                disabled={activeChapterIndex < completedContiguousCount}
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
            </ChapterFooter>
          </>
        )}
      </Main>

      <Modal
        open={showChapterCompleteModal || isCourseComplete}
        onClose={() => {
          if (showChapterCompleteModal) return;
          if (onCourseComplete) onCourseComplete();
          else onBack();
        }}
      >
        <CompletionCard width={CardSizes.Medium}>
          <CardHeader asContainer>
            <FloatingCelebration>
              <ConfettiImage label={t('quiz.completed_confetti_label')} />
            </FloatingCelebration>
          </CardHeader>

          <CardContent marginBottom={theme.spacing.large}>
            <CompletionTitle type={TextTypes.Body2} tag="h2" bold>
              {showChapterCompleteModal
                ? t('onboarding_walkthrough.chapter_complete_title')
                : t('onboarding_walkthrough.course_complete_title')}
            </CompletionTitle>

            <CompletionBody>
              {showChapterCompleteModal
                ? t('onboarding_walkthrough.chapter_complete_description', {
                    chapterTitle: activeChapter.title,
                  })
                : t('onboarding_walkthrough.course_complete_description')}
            </CompletionBody>
          </CardContent>

          <CardFooter>
            {showChapterCompleteModal ? (
              <Button
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Stretch}
                onClick={handleContinueAfterChapterComplete}
              >
                {activeChapterIndex + 1 < chapters.length
                  ? t('onboarding_walkthrough.chapter_complete_button_continue')
                  : t('onboarding_walkthrough.chapter_complete_button_finish')}
              </Button>
            ) : (
              <Button
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Stretch}
                onClick={() => {
                  if (onCourseComplete) onCourseComplete();
                  else onBack();
                }}
              >
                {t('quiz.exit')}
              </Button>
            )}
          </CardFooter>
        </CompletionCard>
      </Modal>
    </CourseContainer>
  );
}
