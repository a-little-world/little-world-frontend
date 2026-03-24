import {
  Button,
  ButtonSizes,
  ButtonVariations,
  Card,
  CardContent,
  CardFooter,
  ProgressBar,
  Text,
} from '@a-little-world/little-world-design-system';
import styled, { css, keyframes } from 'styled-components';

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
  width: 100%;
  max-width: 1240px;
`;

export const QuizContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
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

export const QuizHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const QuizTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ theme, $variant }) =>
    $variant === 'correct'
      ? theme.color.status.success
      : theme.color.status.error};
  color: ${({ theme }) => theme.color.text.reversed};
`;

export const OptionButton = styled(Button).attrs({
  variation: ButtonVariations.Option,
  size: ButtonSizes.Large,
})<{
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

export const FooterRow = styled(CardFooter)`
  display: flex;
  min-height: 49px; // button height
`;

export const CompletionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.large} 0;
`;

export const StyledProgressBar = styled(ProgressBar)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;
