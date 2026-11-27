import styled, { css } from 'styled-components';

import { RandomCallsInstructions } from './RandomCalls.styles';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  align-items: stretch;
  padding: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      flex-direction: row;
      align-items: flex-start;
      gap: ${theme.spacing.medium};
      padding: 0;
    }
  `}
`;

export const CardColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StatusPane = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.large};
`;

/** The random-calls instructions, visible here at every width. */
export const SessionInstructions = styled(RandomCallsInstructions)`
  && {
    display: block;
  }
`;
