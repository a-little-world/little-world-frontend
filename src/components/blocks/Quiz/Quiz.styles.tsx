import {
  Button,
  Card,
  CardHeader,
  ProgressBar,
  Text,
} from '@a-little-world/little-world-design-system';
import styled, { css, keyframes } from 'styled-components';

const MAX_WIDTH = '1040px';

const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const QuizCard = styled(Card)`
  position: relative;
  width: 100%;
  max-width: ${MAX_WIDTH};
  overflow: visible;
  padding-top: ${({ theme }) => theme.spacing.medium};
`;

export const QuizLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
`;

export const StepContainer = styled.div`
  animation: ${fadeSlideIn} 250ms ease-out both;
`;

// Animations (used for question transitions)
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const QuizQuestion = styled(CardHeader)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
  text-align: left;
`;

export const QuizCounter = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const QuestionSection = styled.div<{ $animating: boolean }>`
  width: 100%;
  animation: ${({ $animating }) => ($animating ? slideIn : 'none')} 250ms
    ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const FeedbackSection = styled.div<{ $show: boolean }>`
  animation: ${({ $show }) => ($show ? scaleIn : 'none')} 180ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const QuestionText = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

export const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const IconWrapper = styled.span<{ $variant: 'correct' | 'incorrect' }>`
  width: ${({ theme }) => theme.spacing.medium};
  height: ${({ theme }) => theme.spacing.medium};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ theme, $variant }) =>
    $variant === 'correct' ? theme.color.text.success : theme.color.text.error};
  color: ${({ theme }) => theme.color.text.reversed};
`;

export const OptionButton = styled(Button)<{
  $isCorrect?: boolean;
  $isIncorrect?: boolean;
}>`
  width: 100%;
  max-width: 100%;
  border-color: ${({ theme, $isCorrect, $isIncorrect }) => {
    if ($isCorrect) return theme.color.border.success;
    if ($isIncorrect) return theme.color.border.error;
    return theme.color.border.subtle;
  }};

  background: ${({ theme, $isCorrect, $isIncorrect }) => {
    if ($isCorrect) return theme.color.surface.success;
    if ($isIncorrect) return theme.color.surface.error;
    return theme.color.surface.secondary;
  }};

  color: ${({ theme }) => theme.color.text.primary};

  ${({ theme, $isCorrect, $isIncorrect }) =>
    ($isCorrect || $isIncorrect) &&
    css`
      &:disabled {
        border-color: ${$isCorrect
          ? theme.color.border.success
          : theme.color.border.error};
        background: ${$isCorrect
          ? theme.color.surface.success
          : theme.color.surface.error};
        color: ${theme.color.text.primary};
      }
    `}
`;

export const RequiredLabel = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const ControlsRow = styled.div`
  display: flex;
  min-height: 49px;
  justify-content: flex-end;
  width: 100%;
  max-width: ${MAX_WIDTH};
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 20;
      padding: ${theme.spacing.medium};
      background: ${theme.color.surface.primary};
      border-top: 1px solid ${theme.color.border.subtle};
      box-shadow: 0 -4px 14px rgb(0 0 0 / 12%);
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      position: static;
      padding: 0;
      background: transparent;
      border-top: none;
      box-shadow: none;
    }
  `}
`;

/** Full-width bar with primary action aligned to the end (completed / exit). */
export const ExitControlsRow = styled(ControlsRow)`
  align-items: flex-end;
  justify-content: flex-end;

  & > * {
    align-self: flex-end;
  }
`;

export const StyledProgressBar = styled(ProgressBar)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const FloatingCelebration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 120px;
  width: 100%;

  & > * {
    animation: ${float} 2.8s ease-in-out infinite;
  }
`;
