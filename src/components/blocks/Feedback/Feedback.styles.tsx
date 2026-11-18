import { Button } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      align-items: flex-start;
      padding: 0;
    }
  `};
`;

export const OptionButton = styled(Button)`
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  text-align: left;
`;

export const OptionCopy = styled.span`
  display: flex;
  flex-direction: column;
`;

export const BackButton = styled(Button)`
  align-self: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  font-weight: 600;
`;

export const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;
