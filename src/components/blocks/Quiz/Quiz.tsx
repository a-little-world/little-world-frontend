import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  CardHeader,
  CardSizes,
  CheckIcon,
  CloseIcon,
  ConfettiImage,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CompletionContainer,
  FooterRow,
  IconWrapper,
  OptionButton,
  OptionsGroup,
  QuestionSection,
  QuestionText,
  QuizCard,
  QuizContent,
  QuizCounter,
  QuizHeaderRow,
  QuizTitle,
  StyledProgressBar,
} from './Quiz.styles';

export type QuizOption = {
  id: string;
  label: string;
  ariaLabel?: string;
};

export type QuizStep = {
  id: string;
  question: string;
  required: boolean;
  options: QuizOption[];
  correctOptionId: string;
};

export type QuizAnswer = {
  stepId: string;
  selectedOptionId: string;
  optionIds: string[];
  isCorrect: boolean;
};

export type QuizProps = {
  steps: QuizStep[];
  exitRoute?: string;
  currentStep?: number; // 1-based; only used as initial value
  onAnswer?: (answer: QuizAnswer) => void;
  onComplete?: () => void;
};

function getQuizProgressValue({
  stepIndex,
  stepsLength,
  countsCurrentStepAsDone,
  isCompleted,
}: {
  stepIndex: number; // 0-based
  stepsLength: number;
  countsCurrentStepAsDone: boolean;
  isCompleted: boolean;
}) {
  if (isCompleted) return stepsLength;
  return Math.min(
    stepsLength,
    Math.max(0, stepIndex + (countsCurrentStepAsDone ? 1 : 0)),
  );
}

const Quiz = ({
  steps,
  currentStep = 1,
  exitRoute,
  onAnswer,
  onComplete,
}: QuizProps) => {
  const { t } = useTranslation();

  const initialStepIndex = Math.min(
    Math.max(0, (currentStep ?? 1) - 1),
    Math.max(0, steps.length - 1),
  );

  const [stepIndex, setStepIndex] = useState(initialStepIndex);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const selectionLockedRef = useRef(false);
  const [isQuestionAnimating, setIsQuestionAnimating] = useState(true);
  const [retryAnimationNonce, setRetryAnimationNonce] = useState(0);

  const step = steps[stepIndex];

  const resetStepState = useCallback(() => {
    selectionLockedRef.current = false;
    setSelectedOptionId(null);
    setIsCorrect(null);
  }, []);

  // Reset selection whenever we move to a new step.
  useEffect(() => {
    resetStepState();
  }, [resetStepState, stepIndex]);

  // If the caller changes `steps` and the current step would be out of range,
  // clamp to the last valid step to avoid rendering undefined.
  useEffect(() => {
    if (steps.length === 0) {
      if (stepIndex !== 0) setStepIndex(0);
      return;
    }
    const clampedIndex = Math.min(stepIndex, steps.length - 1);
    if (clampedIndex !== stepIndex) setStepIndex(clampedIndex);
  }, [stepIndex, steps.length]);

  // Question transition animation (forward only).
  useEffect(() => {
    setIsQuestionAnimating(false);
    const timer = setTimeout(() => setIsQuestionAnimating(true), 30);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const hasAnsweredCurrentStep =
    selectedOptionId !== null && isCorrect !== null;
  const isRequired = step?.required === true;
  const isCorrectSelected = isCorrect === true;
  const canProceed = step ? !isRequired || isCorrectSelected : false;
  const countsCurrentStepAsDone =
    hasAnsweredCurrentStep && (!isRequired || isCorrectSelected);

  const optionIds = useMemo(
    () => (step ? step.options.map(o => o.id) : []),
    [step],
  );

  const progressValue = useMemo(
    () =>
      getQuizProgressValue({
        stepIndex,
        stepsLength: steps.length,
        countsCurrentStepAsDone,
        isCompleted,
      }),
    [countsCurrentStepAsDone, isCompleted, stepIndex, steps.length],
  );

  const handleOptionSelect = useCallback(
    (optionId: string) => {
      if (!step || isCompleted) return;
      // Lock UI after the first selection (1a).
      if (selectionLockedRef.current) return;
      selectionLockedRef.current = true;

      const correct = optionId === step.correctOptionId;
      setSelectedOptionId(optionId);
      setIsCorrect(correct);

      try {
        onAnswer?.({
          stepId: step.id,
          selectedOptionId: optionId,
          optionIds,
          isCorrect: correct,
        });
      } catch (_err) {
        // UI should not break if the parent callback throws.
      }
    },
    [isCompleted, onAnswer, optionIds, step],
  );

  const handleRetry = useCallback(() => {
    if (!step || isCompleted) return;
    resetStepState();
    setRetryAnimationNonce(n => n + 1);
  }, [isCompleted, resetStepState, step]);

  const handleNext = useCallback(() => {
    if (!step || isCompleted) return;
    if (!canProceed || !hasAnsweredCurrentStep) return;

    const isLastStep = stepIndex >= steps.length - 1;
    if (isLastStep) {
      setIsCompleted(true);
      try {
        onComplete?.();
      } catch (_err) {
        // Swallow callback errors to avoid breaking the UI.
      }
      return;
    }

    setStepIndex(prev => prev + 1);
  }, [
    canProceed,
    hasAnsweredCurrentStep,
    isCompleted,
    onComplete,
    step,
    stepIndex,
    steps.length,
  ]);

  if (!step || steps.length === 0) return null;

  if (isCompleted) {
    return (
      <QuizCard>
        <QuizContent>
          <CompletionContainer>
            <ConfettiImage label={t('quiz.completed_confetti_label')} />
            <Text type={TextTypes.Body2} tag="h2" bold center>
              {t('quiz.completed_title')}
            </Text>
            <Text center>{t('quiz.completed_description')}</Text>
            {exitRoute && (
              <Link
                to={exitRoute}
                buttonAppearance={ButtonAppearance.Primary}
                buttonSize={ButtonSizes.Stretch}
              >
                {t('quiz.exit')}
              </Link>
            )}
          </CompletionContainer>
        </QuizContent>
      </QuizCard>
    );
  }

  return (
    <QuizCard width={CardSizes.FullWidth}>
      <CardHeader marginBottom={0}>
        <QuizHeaderRow>
          <QuizTitle type={TextTypes.Body2} bold tag="h2">
            {t('quiz.title')}
          </QuizTitle>
          <QuizCounter type={TextTypes.Body4}>
            {t('quiz.question_counter', {
              current: stepIndex + 1,
              total: steps.length,
            })}
          </QuizCounter>
        </QuizHeaderRow>
      </CardHeader>

      <QuizContent>
        <StyledProgressBar fullWidth max={steps.length} value={progressValue} />
        <QuestionText type={TextTypes.Body2} bold tag="h2">
          {step.question}
        </QuestionText>

        <QuestionSection
          key={`${step.id}-${retryAnimationNonce}`}
          $animating={isQuestionAnimating}
        >
          <OptionsGroup
            role="radiogroup"
            aria-label={t('quiz.answer_options_aria_label')}
          >
            {step.options.map(option => {
              const isSelected = option.id === selectedOptionId;
              const showingFeedback = hasAnsweredCurrentStep;
              const isCorrectOption =
                showingFeedback &&
                option.id === step.correctOptionId &&
                (isRequired ? isCorrectSelected : true);
              const isIncorrectOption =
                showingFeedback && isSelected && !isCorrectSelected;

              return (
                <OptionButton
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={option.ariaLabel ?? option.label}
                  $isCorrect={isCorrectOption}
                  $isIncorrect={isIncorrectOption}
                  disabled={showingFeedback}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <span>{option.label}</span>

                  {showingFeedback && isCorrectOption && (
                    <IconWrapper $variant="correct">
                      <CheckIcon
                        label={t('quiz.feedback.correct')}
                        width={16}
                        height={16}
                      />
                    </IconWrapper>
                  )}

                  {showingFeedback && isIncorrectOption && (
                    <IconWrapper $variant="incorrect">
                      <CloseIcon
                        label={t('quiz.feedback.incorrect')}
                        width={16}
                        height={16}
                      />
                    </IconWrapper>
                  )}
                </OptionButton>
              );
            })}
          </OptionsGroup>
        </QuestionSection>
      </QuizContent>

      <FooterRow align="flex-end">
        {hasAnsweredCurrentStep && isRequired && !isCorrectSelected && (
          <Button appearance={ButtonAppearance.Secondary} onClick={handleRetry}>
            {t('quiz.retry')}
          </Button>
        )}

        {canProceed && (
          <Button
            appearance={ButtonAppearance.Primary}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {stepIndex >= steps.length - 1
              ? t('quiz.finish')
              : t('quiz.next_step')}
          </Button>
        )}
      </FooterRow>
    </QuizCard>
  );
};

export default Quiz;
