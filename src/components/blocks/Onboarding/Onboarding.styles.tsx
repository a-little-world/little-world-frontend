import {
  Card,
  CardFooter,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

export const OptionCard = styled(Card)<{
  $inProgress?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: 2px;
  border-color: ${({ theme, $inProgress }) =>
    $inProgress ? theme.color.border.selected : theme.color.border.subtle};
  background: ${({ theme }) => theme.color.surface.secondary};
  padding: ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  min-width: 0;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.border.selected};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.small};
    }
  `}
`;

export const OptionTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  text-align: center;
`;

export const OptionSubtext = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      margin-bottom: ${theme.spacing.xxsmall};
    }
  `}
`;

export const AccomplishSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const AccomplishHeading = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

export const AccomplishList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const AccomplishListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.secondary};
  line-height: 1.4;
`;

export const CheckIcon = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: ${({ theme }) => theme.color.text.highlight};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export function CheckCircleIcon() {
  return (
    <CheckIcon aria-hidden>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M5 8l2.5 2.5L11 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CheckIcon>
  );
}

/** Two-column comparison (How / Duration) or stats */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.small};
`;

/** V1 only: grid so stat boxes fill available width */
export const StatsGridV1 = styled(StatsGrid)`
  width: 100%;

  & > * {
    width: 100%;
    min-width: 0;
  }
`;

export const StatsGridFullWidth = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

export const StatBox = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;
`;
export const StatBoxFullWidth = styled(StatBox)`
  width: 100%;
  min-width: 0;
`;

export const StatLabel = styled(Text)`
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const StatValue = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

export const ProgressValue = styled(Text)`
  color: ${({ theme }) => theme.color.text.success};
`;

export const StackedCardFooter = styled(CardFooter)`
  flex-direction: column;
`;

export function OnboardingOptionComparison({
  variant,
}: {
  variant: 'walkthrough' | 'appointment';
}) {
  const { t } = useTranslation();
  const formatValue =
    variant === 'walkthrough'
      ? t('onboarding_selection.walkthrough_format_value')
      : t('onboarding_selection.appointment_format_value');
  const durationValue =
    variant === 'walkthrough'
      ? t('onboarding_selection.walkthrough_duration')
      : t('onboarding_selection.appointment_duration');

  return (
    <StatsGridV1>
      <StatBox>
        <StatLabel type={TextTypes.Body4}>
          {t('onboarding_selection.comparison_format_label')}
        </StatLabel>
        <StatValue type={TextTypes.Body4} bold>
          {formatValue}
        </StatValue>
      </StatBox>
      <StatBox>
        <StatLabel type={TextTypes.Body4}>
          {t('onboarding_selection.duration_label')}
        </StatLabel>
        <StatValue type={TextTypes.Body4} bold>
          {durationValue}
        </StatValue>
      </StatBox>
    </StatsGridV1>
  );
}
